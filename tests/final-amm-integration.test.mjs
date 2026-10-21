import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { mock } from 'node:test';
import * as CompactJS from '@midnight-ntwrk/compact-js/effect';
import { Contract } from '../artifacts/NorthStarDEX/contract/index.js';
import { makeWitnessBundle } from '../dist/internal/wallet-secrets.js';
import * as artifacts from '../dist/internal/artifacts.js';
import { quoteLiquidityOrder, quoteSwapOrder } from '../dist/internal/quotes.js';
import { providers } from './helpers/providers.mjs';

const calls = [];
let queriedState = null;
let currentWitnesses;
let requeryDuringConstruction = false;
const queuedStates = [];
const decoderOverrides = new Map();
const moduleLoads = [];
const {
  assertAuditedArtifacts,
  assertCompatibleContractState,
  selectCompatibleRelease,
  resolveAmmRelease,
  DEFAULT_COMPILED_DIR,
} = artifacts;
const FINAL_SOURCE = '8e946cfa196ae3019802d3a9daa3b339f366549096358396acee8945b6e73f51';
const RETIRED_SOURCE = '3d04d65bb22ce8381117bfd3d3bc07f8c5336b63502c29ba1048d192c9564e4c';
const REJECTED_SOURCE = '479c614eeafa2d852e78ebf7f5d9c096a41fa44d4bc5af826f2ea28e9120da43';
mock.module('../dist/internal/artifacts.js', {
  exports: {
    ...artifacts,
    loadCompiledModule: async (directory) => {
      const resolved = path.resolve(directory ?? DEFAULT_COMPILED_DIR);
      moduleLoads.push(resolved);
      return decoderOverrides.get(resolved) ?? artifacts.loadCompiledModule(directory);
    },
  },
});
mock.module('../dist/internal/wallet-secrets.js', {
  exports: {
    makeWitnessBundle: (options) => {
      currentWitnesses = makeWitnessBundle(options);
      return currentWitnesses;
    },
  },
});
mock.module('@midnight-ntwrk/midnight-js-contracts', {
  exports: {
    createUnprovenCallTx: async (callProviders, options) => {
      if (requeryDuringConstruction)
        await callProviders.publicDataProvider.queryZSwapAndContractState(options.contractAddress);
      assert.equal(
        CompactJS.ContractExecutable.make(options.compiledContract).getProvableCircuitIds().length,
        11,
      );
      const secret =
        options.circuitId === 'settleLiquidityOrder'
          ? null
          : currentWitnesses.cancelSecret({ privateState: {} })[1];
      calls.push({
        circuitId: options.circuitId,
        args: options.args,
        secretHex: secret === null ? null : Buffer.from(secret).toString('hex'),
        secret,
      });
      return {
        private: { unprovenTx: { serialize: () => Uint8Array.of(1, 2, 3), identifiers: () => ['test-id'] } },
      };
    },
  },
});
const nextState = () => (queuedStates.length ? queuedStates.shift() : queriedState);
mock.module('@midnight-ntwrk/midnight-js-indexer-public-data-provider', {
  exports: {
    indexerPublicDataProvider: () => ({
      queryContractState: async () => nextState(),
      queryZSwapAndContractState: async () => [{}, nextState(), {}],
    }),
  },
});
// Block-evidence checks for Mainnet reads are covered in mainnet-public-data.test.mjs.
mock.module('../dist/internal/public-data-provider.js', {
  exports: { guardedPublicDataProvider: (provider) => provider },
});
// Custom-token scope is covered in mainnet-public-data.test.mjs; these fixtures carry no token data.
const poolStateActual = await import('../dist/internal/pool-state.js');
mock.module('../dist/internal/pool-state.js', {
  exports: { ...poolStateActual, assertStateTokenScope: () => {} },
});
mock.module('../dist/internal/chain-time.js', {
  exports: { readFinalizedChainTime: async () => BigInt(Math.floor(Date.now() / 1000)) },
});
const builders = await import('../dist/transaction-builder.js');
const { providerEnvironment } = await import('../dist/internal/environment.js');
const { readPoolState } = await import('../dist/internal/pool-state.js');
const address = 'ab'.repeat(32);
const wallet = {
  unshieldedAddressHex: '12'.repeat(32),
  coinPublicKey: '34'.repeat(32),
  encryptionPublicKey: '56'.repeat(32),
};
const poolState = {
  contractAddress: address,
  exists: true,
  releaseId: artifacts.AMM_RELEASE_ID,
  ledger: {
    reserveA: '100000',
    reserveB: '200000',
    lpFeeBps: '30',
    protocolFeeShareBps: '1667',
    totalLPSupply: '100000',
  },
  derived: {},
};
const environment = providerEnvironment(providers);
const common = {
  wallet,
  environment,
  pool: address,
  poolState,
  orderId: '78'.repeat(32),
  cancelSecret: '9a'.repeat(32),
  ttlSeconds: 60,
};
const deadline = String(Math.floor(Date.now() / 1000) + 60);
const validState = (directory = DEFAULT_COMPILED_DIR) => {
  const release = assertAuditedArtifacts(directory);
  return {
    operations: () => [...release.releaseCircuits],
    operation: (name) => ({ verifierKey: readFileSync(path.join(directory, 'keys', `${name}.verifier`)) }),
  };
};
const incompatibleState = () => ({
  ...validState(),
  operation: () => ({ verifierKey: Uint8Array.of(1, 2, 3) }),
});

test('final generated constructor accepts the typed complete witness bundle', () => {
  const witnesses = makeWitnessBundle({ cancelSecretBytes: new Uint8Array(32).fill(9) });
  const contract = new Contract(witnesses);
  assert.equal(Object.keys(contract.circuits).length, 11);
  assert.throws(() => witnesses.localSk({ privateState: {} }), /administrative_witness_not_available/);
  assert.throws(() => makeWitnessBundle().cancelSecret({ privateState: {} }), /cancel_secret_required/);
});

test('only the delayed-liquidity release is supported and changed artifacts or unknown manifests fail', () => {
  assert.equal(resolveAmmRelease().sourceSha256, FINAL_SOURCE);
  assert.equal(artifacts.APPROVED_AMM_RELEASES.length, 1);
  assert.equal('LEGACY_COMPILED_DIR' in artifacts, false);
  assert.throws(
    () => resolveAmmRelease('northstar-amm-final-2026-09-27-479c614eeafa'),
    /amm_release_unsupported/,
  );
  assert.throws(
    () => resolveAmmRelease('northstar-amm-deployer-bootstrap-2026-09-27-3d04d65bb22c'),
    /amm_release_unsupported/,
  );
  const directory = mkdtempSync(path.join(tmpdir(), 'northstar-artifacts-'));
  try {
    cpSync(DEFAULT_COMPILED_DIR, directory, { recursive: true });
    assert.equal(assertAuditedArtifacts(directory).sourceSha256, FINAL_SOURCE);
    assert.equal(
      Object.keys(JSON.parse(readFileSync(path.join(directory, 'release.json'), 'utf8')).files).length,
      32,
    );
    for (const [label, relative] of [
      ['key', 'keys/settleOne.prover'],
      ['zkir', 'zkir/settleBatchUpTo5.bzkir'],
    ]) {
      const file = path.join(directory, relative);
      writeFileSync(file, Uint8Array.of(1));
      assert.throws(
        () => assertAuditedArtifacts(directory),
        new RegExp(`compiled_artifact_${label}_files_extra`),
      );
      rmSync(file);
    }
    for (const relative of [
      'contract/index.js',
      'compiler/contract-info.json',
      'keys/depositOrder.prover',
      'keys/settleOne.verifier',
    ]) {
      const file = path.join(directory, relative);
      const original = readFileSync(file);
      writeFileSync(file, Buffer.concat([original, Buffer.from('altered')]));
      assert.throws(() => assertAuditedArtifacts(directory), /compiled_artifact_hash_mismatch/);
      writeFileSync(file, original);
    }
    const manifest = path.join(directory, 'release.json');
    const unsupported = JSON.parse(readFileSync(manifest, 'utf8'));
    for (const source of [REJECTED_SOURCE, RETIRED_SOURCE]) {
      unsupported.sourceSha256 = source;
      writeFileSync(manifest, JSON.stringify(unsupported));
      assert.throws(() => assertAuditedArtifacts(directory), /release_manifest_mismatch/);
    }
    writeFileSync(manifest, '{}');
    assert.throws(() => assertAuditedArtifacts(directory), /release_manifest_mismatch/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('deployed compatibility checks every circuit and rejects foreign, missing and extra operations', () => {
  assert.doesNotThrow(() => assertCompatibleContractState(validState()));
  const stale = validState();
  stale.operation = () => ({ verifierKey: Uint8Array.of(1) });
  assert.throws(() => assertCompatibleContractState(stale), /amm_deployed_verifier_mismatch/);
  const missing = validState();
  missing.operations = () => ['depositOrder'];
  assert.throws(() => assertCompatibleContractState(missing), /deployed_circuits_missing/);
  const extra = validState();
  const operations = extra.operations();
  extra.operations = () => [...operations, 'foreignCircuit'];
  assert.throws(() => assertCompatibleContractState(extra), /deployed_circuits_extra/);
  const duplicate = validState();
  duplicate.operations = () => [...operations, operations[0]];
  assert.throws(() => selectCompatibleRelease(duplicate), /deployed_circuits_duplicates/);
  assert.throws(() => selectCompatibleRelease(missing), /deployed_circuits_missing/);
  assert.throws(() => selectCompatibleRelease(extra), /deployed_circuits_extra/);
  assert.throws(() => selectCompatibleRelease({}), /amm_contract_operations_unavailable/);
});

test('release selection requires every final verifier key and rejects unsupported or mixed programs', () => {
  const selected = selectCompatibleRelease(validState());
  assert.equal(selected.compiledDir, DEFAULT_COMPILED_DIR);
  assert.equal(selected.sourceSha256, FINAL_SOURCE);
  assert.equal(selectCompatibleRelease(validState(), DEFAULT_COMPILED_DIR).releaseId, selected.releaseId);
  assert.throws(() => selectCompatibleRelease(incompatibleState()), /amm_deployed_release_unsupported/);
  assert.throws(
    () => selectCompatibleRelease(incompatibleState(), DEFAULT_COMPILED_DIR),
    /amm_deployed_verifier_mismatch/,
  );
  for (const changedCircuit of selected.releaseCircuits) {
    const mixed = validState();
    mixed.operation = (name) => ({
      verifierKey:
        name === changedCircuit
          ? Uint8Array.of(1, 2, 3)
          : readFileSync(path.join(DEFAULT_COMPILED_DIR, 'keys', `${name}.verifier`)),
    });
    assert.throws(() => selectCompatibleRelease(mixed), /amm_deployed_release_unsupported/);
  }
  const encoded = validState();
  encoded.operations = () =>
    assertAuditedArtifacts().releaseCircuits.map((name) => new TextEncoder().encode(name));
  assert.equal(selectCompatibleRelease(encoded).sourceSha256, FINAL_SOURCE);
});

test('read state checks deployed compatibility before semantic decoding', async () => {
  queriedState = validState();
  queriedState.operation = () => ({ verifierKey: Uint8Array.of(1) });
  let decoded = false;
  moduleLoads.length = 0;
  await assert.rejects(
    () =>
      readPoolState({
        contractAddress: address,
        environment,
        compiledModule: {
          ledger: () => {
            decoded = true;
            return {};
          },
        },
      }),
    /amm_deployed_release_unsupported/,
  );
  assert.equal(decoded, false);
  assert.equal(moduleLoads.length, 0, 'unrecognized state must not select a decoder');
  try {
    const marker = {};
    queriedState = { ...validState(), data: marker };
    const decoder = {
      ledger: (data) => {
        assert.equal(data, marker);
        return {
          tokenTypeA: new Uint8Array(32).fill(1),
          tokenTypeB: new Uint8Array(32).fill(2),
          orderBondTokenType: new Uint8Array(32).fill(3),
          orderBondAmount: 7n,
          protocolFeeShareBps: 1667n,
          masterActionNonce: 3n,
          deployerAuthId: new Uint8Array(32).fill(4),
        };
      },
    };
    decoderOverrides.set(DEFAULT_COMPILED_DIR, decoder);
    const state = await readPoolState({ contractAddress: address, environment });
    assert.equal(moduleLoads.at(-1), DEFAULT_COMPILED_DIR);
    assert.equal(state.releaseId, assertAuditedArtifacts().releaseId);
    assert.equal(state.sourceSha256, FINAL_SOURCE);
    assert.equal(state.ledger.orderBondAmount, '7');
    assert.equal(state.ledger.orderBondTokenType, '03'.repeat(32));
    assert.equal(state.ledger.masterActionNonce, '3');
    assert.equal(state.ledger.deployerAuthId, '04'.repeat(32));
    await assert.rejects(
      () =>
        readPoolState({
          contractAddress: address,
          environment,
          compiledModule: {
            ledger: () => {
              decoded = true;
              return {};
            },
          },
        }),
      /compiled_module.*mismatch|compiled_module.*untrusted/,
    );
    assert.equal(decoded, false);
  } finally {
    decoderOverrides.clear();
  }
});

test('missing pools return an empty read without decoding', async () => {
  queriedState = null;
  moduleLoads.length = 0;
  const state = await readPoolState({ contractAddress: address, environment });
  assert.equal(state.exists, false);
  assert.equal(state.ledger, null);
  assert.equal(moduleLoads.length, 0);
});

test('swap and liquidity builders use final ABI tuples and erase per-call witness buffers', async () => {
  const directory = DEFAULT_COMPILED_DIR;
  queriedState = validState(directory);
  // The contract keeps both liquidity kinds in amountIn, amountAux and minAmountOut.
  for (const [build, input, circuit, direction, fields] of [
    [
      builders.buildDepositOrderTx,
      { direction: 'AtoB', amountIn: '1000', minAmountOut: '2' },
      'depositOrder',
      0,
      [1000n, 2n],
    ],
    [
      builders.buildDepositOrderTx,
      { direction: 'BtoA', amountIn: '1000', minAmountOut: '2' },
      'depositOrder',
      1,
      [1000n, 2n],
    ],
    [
      builders.buildLiquidityOrderTx,
      { kind: 'add', amountA: '300', amountB: '600', minLp: '1', ttlSeconds: undefined },
      'liquidityOrder',
      2,
      [300n, 600n, 1n],
    ],
    [
      builders.buildLiquidityOrderTx,
      { kind: 'remove', lp: '300', minA: '7', minB: '8', ttlSeconds: undefined },
      'liquidityOrder',
      3,
      [300n, 7n, 8n],
    ],
  ]) {
    calls.length = 0;
    const result = await build({ ...common, ...input });
    const call = calls.at(-1);
    assert.equal(call.circuitId, circuit);
    assert.equal(call.args.length, circuit === 'liquidityOrder' ? 9 : 7);
    assert.equal(Buffer.from(call.args[0]).toString('hex'), common.orderId);
    assert.equal(call.args[1], direction);
    assert.deepEqual(call.args.slice(2, 2 + fields.length), fields);
    const deadlineIndex = circuit === 'liquidityOrder' ? 7 : 6;
    assert.equal(call.args[deadlineIndex], BigInt(result.quote.deadline));
    assert.equal(Buffer.from(call.args[deadlineIndex - 1]).toString('hex'), wallet.unshieldedAddressHex);
    assert.equal(call.secretHex, common.cancelSecret);
    assert.ok(call.secret.every((byte) => byte === 0));
    assert.deepEqual(result.built.unprovenTx.identifiers(), ['test-id']);
    assert.equal(result.built.compiledDir, directory);
    assert.equal(result.built.sourceSha256, assertAuditedArtifacts(directory).sourceSha256);
    assert.equal(result.built.releaseId, assertAuditedArtifacts(directory).releaseId);
    assert.equal(moduleLoads.at(-1), directory);
  }
});

test('cancel secrets: an explicit secret wins, otherwise the wallet derives it per pool and order', async () => {
  const directory = DEFAULT_COMPILED_DIR;
  queriedState = validState(directory);
  const derived = 'be'.repeat(32);
  const requests = [];
  const derivingWallet = {
    ...wallet,
    cancelSecret: (pool, orderId) => {
      requests.push([pool, orderId]);
      return derived;
    },
  };
  for (const build of [builders.buildCancelOrderTx, builders.buildCancelLiquidityOrderTx]) {
    for (const [buildWallet, cancelSecret, expected] of [
      [derivingWallet, common.cancelSecret, common.cancelSecret],
      [derivingWallet, undefined, derived],
    ]) {
      const result = await build({ ...common, wallet: buildWallet, cancelSecret });
      const call = calls.at(-1);
      assert.equal(call.args.length, 1);
      assert.equal(Buffer.from(call.args[0]).toString('hex'), common.orderId);
      assert.equal(result.cancelSecret, expected);
      assert.equal(call.secretHex, expected);
      assert.ok(call.secret.every((byte) => byte === 0));
      assert.equal(result.built.compiledDir, directory);
    }
    await assert.rejects(() => build({ ...common, cancelSecret: undefined }), /cancel_secret_required/);
  }
  const order = await builders.buildDepositOrderTx({
    ...common,
    wallet: derivingWallet,
    cancelSecret: undefined,
    direction: 'AtoB',
    amountIn: '1000',
    minAmountOut: '1',
  });
  assert.equal(calls.at(-1).secretHex, derived);
  assert.equal(order.cancelSecret, derived);
  assert.deepEqual(requests.at(-1), [address, common.orderId]);
});

test('limit orders above the current price still build', async () => {
  queriedState = validState();
  const swap = await builders.buildDepositOrderTx({
    ...common,
    direction: 'AtoB',
    amountIn: '1000',
    minAmountOut: '100000',
  });
  assert.ok(BigInt(swap.quote.expectedOut) < BigInt(swap.quote.minAmountOut));
  const add = await builders.buildLiquidityOrderTx({
    ...common,
    kind: 'add',
    amountA: '1',
    amountB: '1',
    minLp: '100000',
    ttlSeconds: undefined,
  });
  assert.ok(BigInt(add.quote.expectedLp ?? 0) < BigInt(add.quote.minLp));
  for (const result of [swap, add]) assert.equal(result.built.compiledDir, DEFAULT_COMPILED_DIR);
});

test('builders reject incompatible keys before and during transaction construction', async () => {
  queriedState = incompatibleState();
  calls.length = 0;
  await assert.rejects(
    () => builders.buildCancelOrderTx({ ...common, compiledDir: DEFAULT_COMPILED_DIR }),
    /amm_deployed_verifier_mismatch/,
  );
  assert.equal(calls.length, 0);
  requeryDuringConstruction = true;
  queuedStates.push(validState(), incompatibleState());
  try {
    await assert.rejects(
      () => builders.buildCancelOrderTx(common),
      /amm_deployed_verifier_mismatch|amm_release_changed|amm_deployed_release_unsupported/,
    );
    assert.equal(calls.filter((call) => call.circuitId).length, 0);
  } finally {
    requeryDuringConstruction = false;
    queuedStates.length = 0;
  }
});

test('malformed amounts, zero identities, invalid TTL and slippage fail before transaction construction', async () => {
  for (const [overrides, expected] of [
    [{ amountIn: Number.MAX_SAFE_INTEGER + 1 }, /safe_integer/],
    [{ amountIn: -1 }, /unsigned_integer/],
    [{ amountIn: 1n << 64n }, /out_of_range/],
    [{ amountIn: 999 }, /out_of_range/],
    [{ minAmountOut: 0 }, /out_of_range/],
    [{ orderId: '00'.repeat(32) }, /order_id_must_not_be_zero/],
    [{ cancelSecret: '00'.repeat(32) }, /cancel_secret_must_not_be_zero/],
    [{ owner: '00'.repeat(32) }, /owner_must_not_be_zero/],
    [{ ttlSeconds: 2_592_001 }, /ttl_seconds_out_of_range/],
    [{ ttlSeconds: 1.5 }, /ttl_seconds_out_of_range/],
    [{ minAmountOut: null, slippageBps: -1 }, /slippage_bps_out_of_range/],
    [{ direction: 'buy' }, /swap_direction_must_be_AtoB_or_BtoA/],
    [{ direction: undefined }, /swap_direction_must_be_AtoB_or_BtoA/],
  ]) {
    calls.length = 0;
    await assert.rejects(
      () =>
        builders.buildDepositOrderTx({
          ...common,
          direction: 'AtoB',
          amountIn: '1000',
          minAmountOut: '1',
          ...overrides,
        }),
      expected,
    );
    assert.equal(calls.length, 0);
  }
});

test('quotes preserve the locked LP unit and use the deployed protocol fee share', () => {
  const removed = quoteLiquidityOrder({
    order: { direction: 3, amountIn: '100', amountAux: '0', minAmountOut: '0', deadline },
    reserveA: '1000',
    reserveB: '2000',
    totalLPSupply: '100',
  });
  assert.equal(removed.eligible, false);
  assert.equal(removed.reason, 'lp_amount_exceeds_circulating_supply');
  const swapped = quoteSwapOrder({
    order: { direction: 0, amountIn: '10000', minAmountOut: '1', deadline },
    reserveA: '100000',
    reserveB: '100000',
    lpFeeBps: '30',
    protocolFeeShareBps: '1667',
  });
  assert.equal(swapped.retainedFee, '5');
  assert.equal(swapped.nextReserveA, '109995');
});

test('cancellation and supplied pool snapshots still reject incompatible live operation sets', async () => {
  queriedState = validState();
  const operations = queriedState.operations();
  queriedState.operations = () => [...operations, 'foreignCircuit'];
  for (const build of [
    builders.buildCancelOrderTx,
    builders.buildCancelLiquidityOrderTx,
    builders.buildDepositOrderTx,
  ]) {
    calls.length = 0;
    await assert.rejects(
      () => build({ ...common, direction: 'AtoB', amountIn: '1000', minAmountOut: '1' }),
      /deployed_circuits_extra/,
    );
    assert.equal(calls.length, 0);
  }
});

test('delayed builder appends internal ninth bound, keeps old ABI and split swap TTL', async () => {
  const release = artifacts.APPROVED_AMM_RELEASES.find((r) => r.sourceSha256.startsWith('8e946'));
  queriedState = validState(release.compiledDir);
  const candidatePool = { ...poolState, releaseId: release.releaseId };
  calls.length = 0;
  const result = await builders.buildLiquidityOrderTx({
    ...common,
    ttlSeconds: undefined,
    poolState: candidatePool,
    kind: 'add',
    amountA: '1000',
    amountB: '2000',
    minLp: '1',
  });
  const call = calls.find((c) => c.circuitId === 'liquidityOrder');
  assert.equal(call.args.length, 9);
  assert.equal(call.args[8] + 2592061n, BigInt(result.quote.publicSettleAfter));
  assert.equal(call.args[7], BigInt(result.quote.deadline));
  assert.equal(call.args[7] - call.args[8], 40n * 86400n);
  assert.equal(result.built.releaseId, release.releaseId);
  await assert.rejects(
    builders.buildLiquidityOrderTx({
      ...common,
      poolState: candidatePool,
      kind: 'add',
      amountA: '1000',
      amountB: '2000',
      minLp: '1',
    }),
    /liquidity_expiry_out_of_range/,
  );
  assert.throws(() => builders.deadlineFromSeconds(40 * 86400), /ttl/);
  queriedState = validState();
});

test('independent public liquidity builder uses only order ID and rejects non-mature or unfillable state', async () => {
  const release = artifacts.APPROVED_AMM_RELEASES.find((r) => r.sourceSha256.startsWith('8e946'));
  const module = await artifacts.loadCompiledModule(release.compiledDir),
    now = BigInt(Math.floor(Date.now() / 1000));
  const id = new Uint8Array(Buffer.from(common.orderId, 'hex'));
  const order = {
    direction: 2,
    amountIn: 1000n,
    amountAux: 2000n,
    minAmountOut: 1n,
    publicSettleAfter: now - 1n,
    deadline: now + 1000n,
    owner: { bytes: id },
    recipient: { bytes: id },
  };
  const ledger = {
    tokenTypeA: new Uint8Array(32).fill(1),
    tokenTypeB: new Uint8Array(32).fill(2),
    orderBondTokenType: new Uint8Array(32).fill(3),
    reserveA: 100000n,
    reserveB: 200000n,
    totalLPSupply: 100000n,
    orderBook: new Map([[id, order]]),
  };
  decoderOverrides.set(release.compiledDir, { ...module, ledger: () => ledger });
  queriedState = validState(release.compiledDir);
  calls.length = 0;
  try {
    const built = await builders.buildPublicLiquiditySettlementTx(common);
    assert.equal(built.built.circuitId, 'settleLiquidityOrder');
    const call = calls.find((x) => x.circuitId === 'settleLiquidityOrder');
    assert.equal(call.args.length, 1);
    assert.equal(call.secret, null);
    assert.throws(
      () => currentWitnesses.localSk({ privateState: {} }),
      /administrative_witness_not_available/,
    );
    order.publicSettleAfter = now + 1000n;
    await assert.rejects(builders.buildPublicLiquiditySettlementTx(common), /not_mature/);
    order.publicSettleAfter = now - 1n;
    order.minAmountOut = 1000000n;
    await assert.rejects(builders.buildPublicLiquiditySettlementTx(common), /unfillable/);
    order.minAmountOut = 1n;
    order.direction = 0;
    await assert.rejects(builders.buildPublicLiquiditySettlementTx(common), /not_mature/);
  } finally {
    decoderOverrides.delete(release.compiledDir);
    queriedState = validState();
  }
});
