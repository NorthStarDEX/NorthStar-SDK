import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test, { mock } from 'node:test';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';
import { DEFAULT_COMPILED_DIR } from '../dist/internal/artifacts.js';
import { makeWitnessBundle } from '../dist/internal/wallet-secrets.js';
import { ContractState } from '@midnight-ntwrk/compact-runtime';

const builder = await import('../dist/transaction-builder.js');
let pool = null;
const calls = [];
mock.module('../dist/transaction-builder.js', {
  exports: {
    ...builder,
    readPool: async () => pool,
    buildUserActionTx: async (options) => {
      calls.push(options);
      return { contractAddress: options.contractAddress, circuitId: options.circuitId };
    },
  },
});
const {
  buildCreatePoolTx,
  buildFundPoolTx,
  initialLpOut,
  NORTHSTAR_POOL_AUTHORITY,
  poolAuthorityId,
  poolCreatorId,
} = await import('../dist/pool.js');
const compiled = await import('../artifacts/NorthStarDEX/contract/index.js');
const { walletFromSeed } = await import('../dist/wallet.js');
const { providers } = await import('./helpers/providers.mjs');

const wallet = walletFromSeed({ seed: '11'.repeat(32) });
const base = {
  wallet,
  tokenA: '01'.repeat(32),
  tokenB: '02'.repeat(32),
  orderBondToken: '01'.repeat(32),
  orderBondAmount: 1000n,
  creatorSecret: '33'.repeat(32),
};
const hex = (bytes) => Buffer.from(bytes).toString('hex');

test('NorthStar authority values match the protocol fee address', () => {
  const decoded = MidnightBech32m.parse('mn_addr1u36ey7qpmnanx5v660tfajx3p7m63avet4uzdp5mz93gl7548ywqp2rk2y');
  assert.equal(
    hex(decoded.decode(UnshieldedAddress, 'mainnet').data),
    NORTHSTAR_POOL_AUTHORITY.protocolFeeRecipient,
  );
  assert.notEqual(NORTHSTAR_POOL_AUTHORITY.masterAuthId, NORTHSTAR_POOL_AUTHORITY.batcherAuthId);
});

test('createPool deploys an immutable pool with the NorthStar identities and creator', async () => {
  const built = await buildCreatePoolTx(base);
  const actions = [...built.built.unprovenTx.intents.values()].flatMap((intent) => intent.actions);
  assert.equal(actions.length, 1);
  const deploy = actions[0];
  assert.equal(deploy.constructor.name, 'ContractDeploy');
  assert.equal(String(deploy.address), built.built.contractAddress);
  assert.deepEqual(deploy.initialState.maintenanceAuthority.committee, []);
  assert.equal(deploy.initialState.maintenanceAuthority.threshold, 1);
  assert.equal(deploy.initialState.operations().length, 11);
  for (const name of deploy.initialState.operations()) {
    assert.deepEqual(
      Buffer.from(deploy.initialState.operation(name).verifierKey),
      readFileSync(path.join(DEFAULT_COMPILED_DIR, 'keys', `${name}.verifier`)),
    );
  }
  assert.equal(built.kind, 'createPool');
  assert.equal(built.creatorSecret, '33'.repeat(32));
  assert.equal(built.built.circuitId, 'deploy');
  assert.equal(poolCreatorId(built.creatorSecret).length, 64);
});

test('createPool stores the requested pool settings', async () => {
  const built = await buildCreatePoolTx({ ...base, lpFeeBps: 50, orderBondAmount: 777n });
  const deploy = [...built.built.unprovenTx.intents.values()][0].actions[0];
  const state = compiled.ledger(ContractState.deserialize(deploy.initialState.serialize()).data);
  assert.equal(state.lpFeeBps, 50n);
  assert.equal(state.orderBondAmount, 777n);
  assert.equal(hex(state.tokenTypeA), base.tokenA);
  assert.equal(hex(state.tokenTypeB), base.tokenB);
  assert.equal(hex(state.masterAuthId), NORTHSTAR_POOL_AUTHORITY.masterAuthId);
  assert.equal(hex(state.protocolFeeRecipientBytes), NORTHSTAR_POOL_AUTHORITY.protocolFeeRecipient);
  assert.equal(hex(state.deployerAuthId), poolCreatorId(base.creatorSecret));
  assert.equal(state.authorizedBatchers.size(), 1n);
  assert.equal(state.totalLPSupply, 0n);
});

test('poolAuthorityId gives the IDs the contract itself derives from master and batcher secrets', () => {
  const contract = new compiled.Contract(
    makeWitnessBundle({ creatorSecretBytes: new Uint8Array(32).fill(1) }),
  );
  const secret = '07'.repeat(32);
  const bytes = new Uint8Array(Buffer.from(secret, 'hex'));
  const master = hex(contract.__authIdForSecret_0(contract.__masterAuthDomain_0(), bytes));
  const batcher = hex(contract.__authIdForSecret_0(contract.__batcherAuthDomain_0(), bytes));
  assert.equal(poolAuthorityId('master', secret), master);
  assert.equal(poolAuthorityId('batcher', secret), batcher);
  assert.notEqual(master, batcher);
  assert.throws(() => poolAuthorityId('creator', secret), /authority_role_must_be_master_or_batcher/u);
  assert.throws(() => poolAuthorityId('batcher', '00'.repeat(32)), /batcher_secret_must_not_be_zero/u);
});

test('createPool takes a custom authority, with the fee recipient given as an mn_addr address', async () => {
  const authority = {
    masterAuthId: poolAuthorityId('master', '07'.repeat(32)),
    batcherAuthId: poolAuthorityId('batcher', '08'.repeat(32)),
    protocolFeeRecipient: wallet.unshieldedAddress,
  };
  const built = await buildCreatePoolTx({ ...base, authority });
  const deploy = [...built.built.unprovenTx.intents.values()][0].actions[0];
  const state = compiled.ledger(ContractState.deserialize(deploy.initialState.serialize()).data);
  assert.equal(hex(state.masterAuthId), authority.masterAuthId);
  assert.equal(hex(state.protocolFeeRecipientBytes), wallet.unshieldedAddressHex);
  assert.equal(state.authorizedBatchers.member(Buffer.from(authority.batcherAuthId, 'hex')), true);
  assert.equal(state.authorizedBatchers.size(), 1n);
});

const settingsOf = (options) => ({
  tokenA: options.tokenA,
  tokenB: options.tokenB,
  lpFeeBps: options.lpFeeBps ?? 30,
  orderBondToken: options.orderBondToken,
  orderBondAmount: options.orderBondAmount,
});

test('createPool derives the creator secret from the wallet and the pool settings', async () => {
  const first = await buildCreatePoolTx({ ...base, creatorSecret: undefined });
  const second = await buildCreatePoolTx({ ...base, creatorSecret: undefined });
  assert.equal(first.creatorSecret, wallet.creatorSecret(settingsOf(base)));
  assert.equal(second.creatorSecret, first.creatorSecret);
  assert.notEqual(first.built.contractAddress, second.built.contractAddress, 'each deploy has its own nonce');
  const otherFee = await buildCreatePoolTx({ ...base, creatorSecret: undefined, lpFeeBps: 50 });
  assert.equal(otherFee.creatorSecret, wallet.creatorSecret(settingsOf({ ...base, lpFeeBps: 50 })));
  assert.notEqual(otherFee.creatorSecret, first.creatorSecret);
  const { creatorSecret: _ignored, ...withoutSecret } = base;
  await assert.rejects(
    () => buildCreatePoolTx({ ...withoutSecret, wallet: { coinPublicKey: '34'.repeat(32) } }),
    /creator_secret_required/,
  );
});

test('createPool rejects bad settings', async () => {
  for (const [bad, error] of [
    [{ tokenA: '00'.repeat(32) }, /mainnet_custom_token_required/],
    [{ tokenB: base.tokenA }, /pool_tokens_must_differ/],
    [{ orderBondToken: '00'.repeat(32) }, /mainnet_custom_token_required/],
    [{ orderBondAmount: 0n }, /order_bond_amount_invalid/],
    [{ lpFeeBps: 1 }, /E_LP_FEE_MIN/],
    [{ lpFeeBps: 5000 }, /E_LP_FEE_MAX/],
    [{ creatorSecret: '00'.repeat(32) }, /creator_secret/],
  ])
    await assert.rejects(() => buildCreatePoolTx({ ...base, ...bad }), error);
});

test('the creator secret is only available to pool creation builders', () => {
  assert.throws(
    () => makeWitnessBundle().localSk({ privateState: {} }),
    /administrative_witness_not_available/,
  );
  const secret = new Uint8Array(32).fill(7);
  assert.equal(makeWitnessBundle({ creatorSecretBytes: secret }).localSk({ privateState: {} })[1], secret);
});

test('fundPool sends the first deposit with the creator secret and minimum LP', async () => {
  const contractAddress = 'cd'.repeat(32);
  pool = { exists: true, ledger: { deployerAuthId: poolCreatorId(base.creatorSecret), totalLPSupply: '0' } };
  calls.length = 0;
  const built = await buildFundPoolTx({
    wallet,
    pool: contractAddress,
    amountA: 10_000n,
    amountB: 40_000n,
    creatorSecret: base.creatorSecret,
  });
  assert.equal(built.kind, 'fundPool');
  assert.equal(initialLpOut(10_000n, 40_000n), 19_999n);
  assert.equal(calls[0].circuitId, 'depositLiquidity');
  assert.equal(calls[0].creatorSecret, base.creatorSecret);
  const args = calls[0].args();
  assert.deepEqual(args.slice(0, 3), [10_000n, 40_000n, 19_999n]);
  assert.equal(hex(args[3]), wallet.unshieldedAddressHex);
});

test('fundPool finds a derived creator secret from the pool settings alone', async () => {
  const derived = wallet.creatorSecret(settingsOf(base));
  const ledger = {
    tokenTypeA: base.tokenA,
    tokenTypeB: base.tokenB,
    lpFeeBps: '30',
    orderBondTokenType: base.orderBondToken,
    orderBondAmount: '1000',
    totalLPSupply: '0',
  };
  pool = { exists: true, ledger: { ...ledger, deployerAuthId: poolCreatorId(derived) } };
  calls.length = 0;
  const options = { wallet, pool: 'cd'.repeat(32), amountA: 10_000n, amountB: 40_000n };
  const built = await buildFundPoolTx(options);
  assert.equal(built.creatorSecret, derived);
  assert.equal(calls[0].creatorSecret, derived);
  pool = { exists: true, ledger: { ...ledger, deployerAuthId: poolCreatorId('44'.repeat(32)) } };
  await assert.rejects(() => buildFundPoolTx(options), /pool_creator_secret_mismatch/);
  assert.equal(calls.length, 1);
});

test('fundPool refuses another creator, a funded pool and a missing pool before building', async () => {
  calls.length = 0;
  const options = {
    wallet,
    pool: 'cd'.repeat(32),
    amountA: 10_000n,
    amountB: 40_000n,
    creatorSecret: base.creatorSecret,
  };
  pool = { exists: true, ledger: { deployerAuthId: poolCreatorId('44'.repeat(32)), totalLPSupply: '0' } };
  await assert.rejects(() => buildFundPoolTx(options), /pool_creator_secret_mismatch/);
  pool = {
    exists: true,
    ledger: { deployerAuthId: poolCreatorId(base.creatorSecret), totalLPSupply: '19999' },
  };
  await assert.rejects(() => buildFundPoolTx(options), /pool_already_funded/);
  pool = { exists: false, ledger: null };
  await assert.rejects(() => buildFundPoolTx(options), /pool_not_found/);
  await assert.rejects(
    () => buildFundPoolTx({ ...options, amountA: 1n, amountB: 1n }),
    /initial_liquidity_too_small/,
  );
  assert.equal(calls.length, 0);
});

test.after(() => wallet.close());

test('northstarsdk createPool and fundPool return the normal prove/balance/submit order', async () => {
  const { northstarsdk } = await import('../dist/index.js');
  const sdk = northstarsdk({ providers, seed: '11'.repeat(32) });
  const { wallet: _wallet, creatorSecret: _secret, ...settings } = base;
  const created = await sdk.createPool(settings);
  assert.equal(created.kind, 'createPool');
  assert.equal(created.creatorSecret, wallet.creatorSecret(settingsOf(base)), 'same seed, same secret');
  assert.equal(JSON.stringify(created).includes(created.creatorSecret), false);
  assert.match(created.pool, /^[0-9a-f]{64}$/u);
  assert.equal(created.orderId, null);
  assert.equal(typeof created.prove, 'function');
  pool = {
    exists: true,
    ledger: {
      tokenTypeA: base.tokenA,
      tokenTypeB: base.tokenB,
      lpFeeBps: '30',
      orderBondTokenType: base.orderBondToken,
      orderBondAmount: '1000',
      deployerAuthId: poolCreatorId(created.creatorSecret),
      totalLPSupply: '0',
    },
  };
  const funded = await sdk.fundPool({
    pool: created.pool,
    amountA: 10_000n,
    amountB: 40_000n,
  });
  assert.equal(funded.kind, 'fundPool');
  assert.equal(funded.creatorSecret, created.creatorSecret);
});
