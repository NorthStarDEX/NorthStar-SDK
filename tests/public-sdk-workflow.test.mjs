import assert from 'node:assert/strict';
import { inspect } from 'node:util';
import test, { beforeEach, mock } from 'node:test';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { APPROVED_AMM_RELEASES } from '../dist/internal/artifacts.js';
import { providers } from './helpers/providers.mjs';

// Exercise the public workflow and its resource ownership without a wallet,
// proof server or network. Integration fixtures cover transaction building.
const OWNER = '12'.repeat(32);
const POOL = 'ab'.repeat(32);
const events = [];
let failAt;
let cleanupFails;
let workflowError;
let mutateBuilt = () => {};
let fixtureRelease = APPROVED_AMM_RELEASES[0];
const initialCheckpoint = { network: 'mainnet', account: 2, keyIndex: 3, unshieldedAddressHex: OWNER };
const nextCheckpoint = { ...initialCheckpoint, marker: 'next' };
const tx = { identifiers: () => ['intent-id', 'final-id'] };
let syncedState;
const provenTx = { marker: 'proven' };
const record = (name, value) => {
  events.push({ name, value });
  if (failAt === name) {
    workflowError = new Error(`fixture_${name}_failure`);
    throw workflowError;
  }
};
const facade = {
  start: async (...args) => record('start', args),
  waitForSyncedState: async () => record('sync'),
};
const runtime = {
  facade,
  shieldedSecretKeys: {},
  dustSecretKey: {},
  unshieldedKeyStore: {},
  txHistoryStorage: {},
};
const builtOrder = (kind, options) => {
  const order = {
    kind,
    orderId: options.orderId ?? 'order-id',
    cancelSecret: options.cancelSecret ?? 'fixture-cancel-secret',
    quote: { marker: 'quote' },
    built: {
      ...fixtureRelease,
      contractAddress: options.pool,
      circuitId: kind,
      unprovenTx: { marker: 'unproven' },
    },
  };
  mutateBuilt(order.built);
  return order;
};
const build = (name, kind) => async (options) => {
  record(name, options);
  return builtOrder(kind, options);
};
const read = (name) => async (options) => {
  record(name, options);
  return { kind: name, options };
};
mock.module('../dist/transaction-builder.js', {
  exports: {
    buildDepositOrderTx: build('buildDepositOrderTx', 'swap'),
    buildLiquidityOrderTx: build('buildLiquidityOrderTx', 'addLiquidity'),
    buildCancelOrderTx: build('buildCancelOrderTx', 'cancelSwap'),
    buildCancelLiquidityOrderTx: build('buildCancelLiquidityOrderTx', 'cancelLiquidity'),
    buildPublicLiquiditySettlementTx: build('buildPublicLiquiditySettlementTx', 'settleLiquidity'),
    getOrder: read('getOrder'),
    getPool: read('getPool'),
    getPoolPrice: read('getPoolPrice'),
    quoteLiquidity: read('quoteLiquidity'),
    quoteSwap: read('quoteSwap'),
    readPool: read('readPool'),
  },
});
mock.module('../dist/pool.js', {
  exports: {
    buildCreatePoolTx: build('buildCreatePoolTx', 'createPool'),
    buildFundPoolTx: build('buildFundPoolTx', 'fundPool'),
    NORTHSTAR_POOL_AUTHORITY: {},
    initialLpOut: () => 0n,
    poolAuthorityId: () => '',
    poolCreatorId: () => '',
  },
});
mock.module('../dist/wallet.js', {
  exports: {
    walletFromSeed: (options) => {
      record('walletMaterial', options);
      return {
        unshieldedAddress: 'fixture-address',
        unshieldedAddressHex: OWNER,
        dustAddress: 'fixture-dust',
        close: () => record('materialClose'),
      };
    },
  },
});
mock.module('../dist/runtime.js', {
  exports: {
    DEFAULT_PROVING_SERVER_URL: 'http://127.0.0.1:6300',
    DEFAULT_TX_TTL_SECONDS: 3600,
    openWalletRuntime: async (options) => {
      record('open', options);
      return runtime;
    },
    proveUnprovenTransaction: async (options) => {
      record('prove', options);
      return provenTx;
    },
    balanceProvenTransaction: async (options) => {
      record('balance', options);
      return tx;
    },
    transactionFee: async (options) => {
      record('fee', options);
      return 26n;
    },
    submitFinalized: async (options) => {
      record('submit', options);
      return { txHash: 'chain-tx-id', blockHash: 'block-hash', blockHeight: 123 };
    },
    serializeRuntimeCheckpoint: async (options) => {
      record('checkpoint', options);
      return nextCheckpoint;
    },
    stopWalletRuntime: async (value) => {
      record('stop', value);
      if (cleanupFails) throw new Error('fixture_cleanup_failure');
    },
    waitForWalletSync: async (value, options) => {
      record('walletSync', options);
      await value.waitForSyncedState();
      options.onProgress?.({ synced: true, shielded: 100, unshielded: 100, dust: 100 });
      return syncedState;
    },
  },
});
const {
  northstarsdk,
  NorthStarSDK,
  NorthStarBuiltOrder,
  NorthStarProvenOrder,
  NorthStarBalancedOrder,
  NorthStarPostSubmissionError,
} = await import('../dist/index.js');
const makeSdk = (overrides = {}) =>
  northstarsdk({ providers, seed: 'fixture-seed', checkpoint: initialCheckpoint, ...overrides });
const event = (name) => events.find((e) => e.name === name)?.value;
const count = (name) => events.filter((e) => e.name === name).length;
const swap = { pool: POOL, direction: 'BtoA', amountIn: 1000n, slippageBps: 50 };
beforeEach(() => {
  events.length = 0;
  failAt = undefined;
  cleanupFails = false;
  workflowError = undefined;
  mutateBuilt = () => {};
  fixtureRelease = APPROVED_AMM_RELEASES[0];
  syncedState = undefined;
});

test('public factory retains checkpoint defaults and allows explicit checkpoint replacement', () => {
  const sdk = makeSdk();
  assert(sdk instanceof NorthStarSDK);
  assert.equal(sdk.account, 2);
  assert.equal(sdk.keyIndex, 3);
  assert.equal(sdk.checkpoint, initialCheckpoint);
  sdk.setCheckpoint(nextCheckpoint);
  assert.equal(sdk.checkpoint, nextCheckpoint);
  sdk.setCheckpoint(null);
  assert.equal(sdk.checkpoint, null);
  assert.equal(makeSdk({ account: 4, keyIndex: 5 }).account, 4);
});

test('reads and quotes pass the pool and the configured providers', async () => {
  const sdk = makeSdk();
  for (const [call, name] of [
    [() => sdk.getPrice(POOL), 'getPoolPrice'],
    [() => sdk.getPool(POOL), 'getPool'],
    [() => sdk.getOrder(POOL, 'order-id'), 'getOrder'],
    [() => sdk.quoteSwapOrder({ ...swap, environment: 'ignored' }), 'quoteSwap'],
    [
      () => sdk.quoteLiquidityOrder({ pool: POOL, kind: 'add', amountA: 1n, amountB: 1n, minLp: 1n }),
      'quoteLiquidity',
    ],
  ]) {
    const result = await call();
    assert.equal(result.kind, name);
    assert.equal(result.options.pool, POOL);
    assert.equal(result.options.environment.nodeWS, providers.nodeWs);
  }
  assert.equal(event('getOrder').orderId, 'order-id');
  assert.equal(count('open'), 0);
  assert.equal(count('walletMaterial'), 0);
});

test('every builder gets the SDK wallet and providers, never values from the options', async () => {
  const sdk = makeSdk();
  for (const [method, target, options] of [
    ['buildSwapOrder', 'buildDepositOrderTx', swap],
    [
      'buildLiquidityOrder',
      'buildLiquidityOrderTx',
      { pool: POOL, kind: 'remove', lp: 1n, minA: 0n, minB: 0n },
    ],
    ['buildCancelOrder', 'buildCancelOrderTx', { pool: POOL, orderId: 'wanted-order' }],
    ['buildCancelLiquidityOrder', 'buildCancelLiquidityOrderTx', { pool: POOL, orderId: 'wanted-order' }],
    [
      'buildPublicLiquiditySettlement',
      'buildPublicLiquiditySettlementTx',
      { pool: POOL, orderId: 'wanted-order' },
    ],
    ['fundPool', 'buildFundPoolTx', { pool: POOL, amountA: 1n, amountB: 1n }],
  ]) {
    events.length = 0;
    const built = await sdk[method]({ ...options, wallet: 'wrong', environment: 'wrong' });
    assert(built instanceof NorthStarBuiltOrder);
    assert.equal(built.pool, POOL);
    const passed = event(target);
    assert.equal(passed.wallet.unshieldedAddressHex, OWNER);
    assert.equal(passed.environment.indexer, providers.indexer);
    for (const [key, value] of Object.entries(options)) assert.equal(passed[key], value);
    assert.equal(count('materialClose'), 1, 'the wallet is closed once the order is built');
    assert.equal(count('open'), 0, 'build must not start a runtime or submit');
    assert.deepEqual(Object.keys(built.toJSON()), ['kind', 'pool', 'orderId', 'quote']);
  }
  const created = await sdk.createPool({
    tokenA: '01',
    tokenB: '02',
    orderBondToken: '01',
    orderBondAmount: 1n,
  });
  assert.equal(event('buildCreatePoolTx').txTtlSeconds, 3600);
  assert.equal(created.kind, 'createPool');
});

test('staged prove, balance and submit advance the checkpoint and return the accepted transaction', async () => {
  const sdk = makeSdk({ provingServerUrl: 'fixture-prover', txTtlSeconds: 91 });
  const built = await sdk.buildSwapOrder(swap);
  events.length = 0;
  const proven = await built.prove();
  assert(proven instanceof NorthStarProvenOrder);
  assert.equal(event('open').checkpoint, initialCheckpoint);
  assert.equal(event('open').provingServerUrl, 'fixture-prover');
  assert.equal(event('open').compiledDir, fixtureRelease.compiledDir);
  assert.equal(event('open').environment.nodeWS, providers.nodeWs);
  assert.equal(event('open').wallet.seed, 'fixture-seed', 'the runtime receives the seed only when it opens');
  assert.equal(event('prove').unprovenTx.marker, 'unproven');
  const balanced = await proven.balance();
  assert(balanced instanceof NorthStarBalancedOrder);
  assert.equal(event('balance').provenTx, provenTx);
  assert.equal(event('balance').txTtlSeconds, 91);
  assert.equal(balanced.fee, 26n);
  const submitted = await balanced.submit();
  assert.equal(event('submit').waitForStatus, 'Finalized');
  assert.equal(event('checkpoint').checkpoint, initialCheckpoint);
  assert.deepEqual(submitted, {
    txId: 'chain-tx-id',
    blockHash: 'block-hash',
    blockHeight: 123,
    checkpoint: nextCheckpoint,
  });
  assert.equal(sdk.checkpoint, nextCheckpoint);
  assert.deepEqual(
    events.map((x) => x.name),
    [
      'walletMaterial',
      'materialClose',
      'open',
      'start',
      'walletSync',
      'sync',
      'prove',
      'balance',
      'fee',
      'submit',
      'checkpoint',
      'stop',
    ],
  );
  // The wallet has an hour to catch up before proving, then the order fails instead of hanging.
  assert.equal(event('walletSync').timeoutMs, 3_600_000);
  await sdk.buildCancelOrder({ pool: POOL, orderId: built.orderId });
  assert.equal(event('buildCancelOrderTx').orderId, built.orderId);
});

test('proving refuses an order whose release changed on disk', async () => {
  for (const [change, expected] of [
    [
      (built) => {
        built.releaseId = 'unsupported-release';
      },
      /amm_built_order_release_mismatch/,
    ],
    [
      (built) => {
        built.sourceSha256 = '00'.repeat(32);
      },
      /amm_built_order_release_mismatch/,
    ],
    [
      (built) => {
        built.compiledDir = 'unsupported-artifact-directory';
      },
      /compiled_artifact_release_manifest_missing/,
    ],
  ]) {
    mutateBuilt = change;
    const built = await makeSdk().buildSwapOrder(swap);
    events.length = 0;
    await assert.rejects(() => built.prove(), expected);
    assert.equal(count('open'), 0);
    assert.equal(count('prove'), 0);
  }
});

test('an old release manifest cannot open the wallet runtime', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'northstar-workflow-rejected-release-'));
  try {
    cpSync(APPROVED_AMM_RELEASES[0].compiledDir, directory, { recursive: true });
    const manifestPath = path.join(directory, 'release.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.sourceSha256 = '479c614eeafa2d852e78ebf7f5d9c096a41fa44d4bc5af826f2ea28e9120da43';
    writeFileSync(manifestPath, JSON.stringify(manifest));
    mutateBuilt = (built) => {
      built.compiledDir = directory;
    };
    const built = await makeSdk().buildSwapOrder(swap);
    events.length = 0;
    await assert.rejects(() => built.prove(), /compiled_artifact_release_manifest_mismatch/);
    assert.equal(count('open'), 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('convenience submit completes the same stages once and uses configured defaults', async () => {
  const sdk = makeSdk({ provingServerUrl: 'configured-prover', txTtlSeconds: 701 });
  const built = await sdk.buildCancelLiquidityOrder({ pool: POOL, orderId: 'expired-order' });
  const result = await built.submit({ waitForStatus: 'InBlock' });
  assert.equal(event('open').provingServerUrl, 'configured-prover');
  assert.equal(event('balance').txTtlSeconds, 701);
  assert.equal(event('submit').waitForStatus, 'InBlock');
  assert.equal(result.txId, 'chain-tx-id');
  for (const name of ['open', 'start', 'sync', 'prove', 'balance', 'fee', 'submit', 'checkpoint', 'stop'])
    assert.equal(count(name), 1, name);
});

test('one wallet runtime at a time: a second order waits for the first to finish', async () => {
  const sdk = makeSdk();
  const first = await sdk.buildSwapOrder(swap);
  const second = await sdk.buildSwapOrder(swap);
  const proven = await first.prove();
  await assert.rejects(() => second.prove(), /wallet_busy/);
  await assert.rejects(() => sdk.sync(), /wallet_busy/);
  assert.equal(count('open'), 1);
  await proven.close();
  const again = await second.prove();
  await again.close();
  await (await sdk.buildSwapOrder(swap)).submit();
  await (await sdk.buildSwapOrder(swap)).submit();
  assert.equal(count('open'), 4);
  failAt = 'start';
  await assert.rejects(() => first.prove(), /fixture_start_failure/);
  failAt = undefined;
  await (await first.prove()).close();
});

test('the seed and order secrets stay out of JSON, console output and results', async () => {
  const sdk = makeSdk();
  const built = await sdk.buildSwapOrder({ ...swap, cancelSecret: 'own-secret' });
  assert.equal(built.cancelSecret, 'own-secret', 'an explicit getter returns it');
  assert.equal(Object.keys(built).includes('cancelSecret'), false);
  const proven = await built.prove();
  const balanced = await proven.balance();
  for (const value of [sdk, built, proven, balanced]) {
    for (const text of [
      JSON.stringify(value, (_key, item) => (typeof item === 'bigint' ? `${item}` : item)),
      inspect(value, { depth: 10 }),
    ]) {
      assert.equal(text.includes('fixture-seed'), false);
      assert.equal(text.includes('own-secret'), false);
    }
  }
  const submitted = await balanced.submit();
  assert.equal(JSON.stringify(submitted).includes('own-secret'), false);
});

test('explicit close works at both proven and balanced stages without submission', async () => {
  for (const balance of [false, true]) {
    events.length = 0;
    const built = await makeSdk().buildSwapOrder(swap);
    const proven = await built.prove();
    const handle = balance ? await proven.balance() : proven;
    await handle.close();
    assert.equal(count('stop'), 1);
    assert.equal(count('submit'), 0);
    assert.equal(count('checkpoint'), 0);
  }
});

for (const failedStage of ['start', 'sync', 'prove', 'balance', 'fee', 'submit']) {
  test(`a failed ${failedStage} closes the wallet and keeps the old checkpoint`, async () => {
    const sdk = makeSdk();
    const built = await sdk.buildSwapOrder(swap);
    failAt = failedStage;
    await assert.rejects(() => built.submit(), new RegExp(`fixture_${failedStage}_failure`));
    assert.equal(count('stop'), 1, 'a failed workflow must not retain a running wallet');
    assert.equal(count('submit'), failedStage === 'submit' ? 1 : 0);
    assert.equal(sdk.checkpoint, initialCheckpoint);
  });
}

test('cleanup failures preserve the original workflow error at every owned stage', async () => {
  for (const stage of ['start', 'sync', 'prove', 'balance', 'fee', 'submit']) {
    events.length = 0;
    const sdk = makeSdk();
    const built = await sdk.buildSwapOrder(swap);
    failAt = stage;
    cleanupFails = true;
    await assert.rejects(
      () => built.submit(),
      (error) => error === workflowError && error.message === `fixture_${stage}_failure`,
    );
    assert.equal(count('stop'), 1);
    assert.equal(sdk.checkpoint, initialCheckpoint);
  }
});

for (const failure of ['checkpoint', 'cleanup', 'both']) {
  test(`an accepted submission survives a ${failure} failure with its transaction ID`, async () => {
    const sdk = makeSdk();
    const built = await sdk.buildSwapOrder(swap);
    failAt = failure === 'cleanup' ? undefined : 'checkpoint';
    cleanupFails = failure !== 'checkpoint';
    await assert.rejects(
      () => built.submit(),
      (error) => {
        assert(error instanceof NorthStarPostSubmissionError);
        assert.equal(error.submitted, true);
        assert.deepEqual(error.accepted, { txId: 'chain-tx-id', blockHash: 'block-hash', blockHeight: 123 });
        assert.equal(error.checkpoint, failure === 'cleanup' ? nextCheckpoint : null);
        assert.equal(Boolean(error.checkpointError), failure !== 'cleanup');
        assert.equal(Boolean(error.cleanupError), failure !== 'checkpoint');
        assert.equal(JSON.stringify(error).includes('marker'), false, 'the checkpoint stays out of JSON');
        return true;
      },
    );
    assert.equal(count('submit'), 1);
    assert.equal(count('checkpoint'), 1);
    assert.equal(count('stop'), 1);
    assert.equal(sdk.checkpoint, failure === 'cleanup' ? nextCheckpoint : initialCheckpoint);
  });
}

test('sync opens the wallet without a prover, saves the checkpoint and closes the wallet', async () => {
  const sdk = makeSdk();
  const progress = [];
  const checkpoint = await sdk.sync({ timeoutMs: 1234, onProgress: (value) => progress.push(value) });
  assert.equal(checkpoint, nextCheckpoint);
  assert.equal(sdk.checkpoint, nextCheckpoint);
  assert.equal(event('open').provingServerUrl, undefined);
  assert.equal(event('open').checkpoint, initialCheckpoint);
  assert.equal(event('walletSync').timeoutMs, 1234);
  assert.deepEqual(progress.at(-1), { synced: true, shielded: 100, unshielded: 100, dust: 100 });
  assert.deepEqual(
    events.map((x) => x.name),
    ['walletMaterial', 'materialClose', 'open', 'start', 'walletSync', 'sync', 'checkpoint', 'stop'],
  );
});

test('balances syncs the wallet, returns token and DUST amounts as strings and saves the checkpoint', async () => {
  const sdk = makeSdk();
  const times = [];
  syncedState = {
    unshielded: { balances: { ['00'.repeat(32)]: 100_000_000n, ['b7'.repeat(32)]: 5_000n } },
    dust: {
      balance: (time) => {
        times.push(time);
        return 2_500_000_000_000_000n;
      },
    },
  };
  const balances = await sdk.balances({ timeoutMs: 1234 });
  assert.deepEqual(balances, {
    unshielded: { ['00'.repeat(32)]: '100000000', ['b7'.repeat(32)]: '5000' },
    dust: '2500000000000000',
  });
  assert(times[0] instanceof Date);
  assert.equal(sdk.checkpoint, nextCheckpoint);
  assert.equal(event('walletSync').timeoutMs, 1234);
  assert.deepEqual(
    events.map((x) => x.name),
    ['walletMaterial', 'materialClose', 'open', 'start', 'walletSync', 'sync', 'checkpoint', 'stop'],
  );
});

test('balances fails and closes the wallet when the synced state has no balances', async () => {
  const sdk = makeSdk();
  syncedState = { unshielded: {} };
  await assert.rejects(() => sdk.balances(), /wallet_balances_unavailable/);
  assert.equal(count('stop'), 1);
  assert.equal(count('checkpoint'), 0);
  assert.equal(sdk.checkpoint, initialCheckpoint);
});

test('a failed sync closes the wallet and keeps the old checkpoint', async () => {
  const sdk = makeSdk();
  failAt = 'start';
  await assert.rejects(() => sdk.sync(), /fixture_start_failure/);
  assert.equal(count('stop'), 1);
  assert.equal(count('checkpoint'), 0);
  assert.equal(sdk.checkpoint, initialCheckpoint);
});
