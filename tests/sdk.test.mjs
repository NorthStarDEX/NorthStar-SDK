import assert from 'node:assert/strict';
import { createHmac, hkdfSync } from 'node:crypto';
import { inspect } from 'node:util';
import test from 'node:test';

import * as publicApi from '../dist/index.js';
import {
  DEFAULT_PROVING_SERVER_URL,
  DEFAULT_TX_TTL_SECONDS,
  MIN_SWAP_AMOUNT,
  NorthStarSDK,
  northstarsdk,
} from '../dist/index.js';
import { walletFromSeed } from '../dist/wallet.js';
import {
  buildCancelOrderTx,
  buildDepositOrderTx,
  DEFAULT_ORDER_TTL_SECONDS,
  deadlineFromSeconds,
  normalizeSwapDirection,
  randomOrderId,
} from '../dist/transaction-builder.js';
import { applySlippageBps, quoteLiquidityOrder, quoteSwapOrder } from '../dist/internal/quotes.js';
import { assertAuditedArtifacts } from '../dist/internal/artifacts.js';
import { providers } from './helpers/providers.mjs';

const pool = 'ab'.repeat(32);
const poolState = {
  contractAddress: pool,
  exists: true,
  ledger: { reserveA: '100000', reserveB: '100000', lpFeeBps: '30', totalLPSupply: '100000' },
  derived: { priceBPerA: 1, priceAPerB: 1 },
};

test('randomOrderId creates bytes32 hex identifiers', () => {
  assert.match(randomOrderId(), /^[0-9a-f]{64}$/u);
});

test('deadlineFromSeconds returns a future unix timestamp', () => {
  const before = Math.floor(Date.now() / 1000);
  const deadline = Number(deadlineFromSeconds(60));
  assert.ok(deadline >= before + 55);
  assert.ok(deadline <= before + 65);
  assert.equal(DEFAULT_ORDER_TTL_SECONDS, 1_814_400);
});

test('swap directions are exactly AtoB or BtoA', () => {
  assert.deepEqual(normalizeSwapDirection('AtoB'), { name: 'AtoB', value: 0 });
  assert.deepEqual(normalizeSwapDirection('BtoA'), { name: 'BtoA', value: 1 });
  for (const direction of ['buy', 'sell', 'atob', 'BTOA', 'a-to-b', '0', 0, 1, '', undefined, null])
    assert.throws(() => normalizeSwapDirection(direction), /swap_direction_must_be_AtoB_or_BtoA/);
});

test('root export is minimal', () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    'BLOCKFROST_MAINNET_TARGETS',
    'CLIENT_LIQUIDITY_TTL_SECONDS',
    'DEFAULT_PROVING_SERVER_URL',
    'DEFAULT_TX_TTL_SECONDS',
    'MIN_SWAP_AMOUNT',
    'NORTHSTAR_POOL_AUTHORITY',
    'NorthStarBalancedOrder',
    'NorthStarBuiltOrder',
    'NorthStarPostSubmissionError',
    'NorthStarProvenOrder',
    'NorthStarSDK',
    'PUBLIC_LIQUIDITY_DELAY_SECONDS',
    'initialLpOut',
    'northstarsdk',
    'poolAuthorityId',
    'poolCreatorId',
    'startProviderRelay',
  ]);
  assert.equal(DEFAULT_PROVING_SERVER_URL, 'http://127.0.0.1:6300');
  assert.equal(DEFAULT_TX_TTL_SECONDS, 3600);
  assert.equal(MIN_SWAP_AMOUNT, 1000n);
  for (const name of ['walletFromSeed', 'buildDepositOrderTx', 'getPoolPrice', 'quoteSwap', 'readPool'])
    assert.equal(name in publicApi, false, name);
});

test('the release keeps the four user order actions', () => {
  assert.deepEqual(assertAuditedArtifacts().circuits, [
    'depositOrder',
    'cancelOrder',
    'liquidityOrder',
    'cancelLiquidityOrder',
  ]);
});

test('the SDK keeps its seed private', () => {
  const sdk = northstarsdk({ providers, seed: '00'.repeat(32) });
  assert(sdk instanceof NorthStarSDK);
  assert.equal('seed' in sdk, false);
  assert.equal(JSON.stringify(sdk).includes('00'.repeat(32)), false);
  assert.equal(inspect(sdk, { depth: 5 }).includes('00'.repeat(32)), false);
});

test('swap and liquidity options are checked before any network read', async () => {
  const sdk = northstarsdk({ providers, seed: '00'.repeat(32) });
  for (const [method, options, error] of [
    ['buildSwapOrder', { direction: 'AtoB', amountIn: 1000n, slippageBps: 50 }, /invalid_pool/],
    [
      'quoteSwapOrder',
      { pool: 'not-hex', direction: 'AtoB', amountIn: 1000n, slippageBps: 50 },
      /invalid_pool/,
    ],
    [
      'buildSwapOrder',
      { pool, direction: 'AtoB', amountIn: 999n, slippageBps: 50 },
      /amount_in_out_of_range/,
    ],
    ['buildLiquidityOrder', { pool, kind: 'inject', amountA: 1n }, /liquidity_kind_must_be_add_or_remove/],
    [
      'quoteLiquidityOrder',
      { pool, kind: 'add', amountA: 1n, amountB: 1n, minLp: 0n },
      /min_lp_out_of_range/,
    ],
    ['buildLiquidityOrder', { pool, kind: 'remove', lp: 0n, minA: 0n, minB: 0n }, /lp_out_of_range/],
    ['buildCancelOrder', { pool, orderId: '00'.repeat(32) }, /order_id_must_not_be_zero/],
    ['getOrder', pool, /invalid_order_id/],
  ])
    await assert.rejects(() => sdk[method](options), error, method);
});

test('quoteSwapOrder applies AMM math and slippage helper clamps output', () => {
  const quote = quoteSwapOrder({
    order: {
      direction: 0,
      amountIn: '100000',
      amountAux: '0',
      minAmountOut: '1',
      deadline: String(Math.floor(Date.now() / 1000) + 60),
    },
    reserveA: '10000000',
    reserveB: '20000000',
    lpFeeBps: '30',
  });
  assert.equal(quote.eligible, true);
  assert.ok(BigInt(quote.quotedAmountOut) > 0n);
  assert.equal(applySlippageBps({ quotedAmount: '1000', slippageBps: 100, minimum: 1n }), '990');
});

test('quoteLiquidityOrder quotes add liquidity', () => {
  const quote = quoteLiquidityOrder({
    order: {
      direction: 2,
      amountIn: '1000',
      amountAux: '1000',
      minAmountOut: '1',
      deadline: String(Math.floor(Date.now() / 1000) + 60),
    },
    reserveA: '100000',
    reserveB: '100000',
    totalLPSupply: '100000',
  });
  assert.equal(quote.eligible, true);
  assert.equal(quote.quotedLpOut, '1000');
});

test('builders reject supplied missing pools before provider access', async () => {
  await assert.rejects(
    () =>
      buildDepositOrderTx({
        wallet: { unshieldedAddressHex: '12'.repeat(32) },
        pool,
        poolState: { ...poolState, exists: false, ledger: null },
        direction: 'AtoB',
        amountIn: '1000',
        minAmountOut: '1',
        cancelSecret: '9a'.repeat(32),
      }),
    /pool_not_found/u,
  );
});

test('cancellation needs a secret when the wallet cannot derive one', async () => {
  await assert.rejects(
    () => buildCancelOrderTx({ wallet: {}, pool, orderId: '11'.repeat(32) }),
    /cancel_secret_required/u,
  );
});

test('wallet addresses match the Midnight address format exactly', () => {
  for (const [seed, unshielded, dust] of [
    [
      '00'.repeat(32),
      'mn_addr13h0e3c2m7rcfem6wvjljnyjmxy5rkg9kkwcldzt73ya5pv7c4p8shdxvu5',
      'mn_dust1da40n96p3afrvs84zhuw354z755hhus5e3g49j0aw3c4gte3kmkswktufs',
    ],
    [
      '11'.repeat(32),
      'mn_addr164t3m7skgcgnjv7r7xmduxhnznvdvz4wu0pw08ks865cg6eu6nss0n8gq8',
      'mn_dust1wdrwfr7qclte78faxwalh6qvxcm5vgjmv5dl6lsa36ukyf0cnedxg0fz5rq',
    ],
  ]) {
    const wallet = walletFromSeed({ seed });
    try {
      assert.equal(wallet.unshieldedAddress, unshielded);
      assert.equal(wallet.dustAddress, dust);
      assert.match(wallet.unshieldedAddressHex, /^[0-9a-f]{64}$/u);
      assert.match(wallet.coinPublicKey, /^[0-9a-f]{64}$/u);
      assert.equal(typeof wallet.encryptionPublicKey, 'string');
    } finally {
      wallet.close();
    }
    assert.deepEqual(northstarsdk({ providers, seed }).addresses(), { unshielded, dust });
  }
});

test('order and pool secrets are derived from the seed and never change between releases', () => {
  // HKDF-SHA256(seed, salt 'northstar-sdk', info 'order-secrets/v1/<account>/<keyIndex>'),
  // then HMAC-SHA256 over a purpose label and the order or pool fields.
  const key = hkdfSync('sha256', Buffer.alloc(32), 'northstar-sdk', 'order-secrets/v1/0/0', 32);
  const hmac = (...parts) =>
    createHmac('sha256', Buffer.from(key)).update(Buffer.concat(parts)).digest('hex');
  const hex = (value) => Buffer.from(value, 'hex');
  const uint128 = (value) => Buffer.from(value.toString(16).padStart(32, '0'), 'hex');
  const orderId = 'cd'.repeat(32);
  const settings = {
    tokenA: '01'.repeat(32),
    tokenB: '02'.repeat(32),
    lpFeeBps: 30,
    orderBondToken: '01'.repeat(32),
    orderBondAmount: 1000n,
  };
  const wallet = walletFromSeed({ seed: '00'.repeat(32) });
  try {
    const cancel = wallet.cancelSecret(pool, orderId);
    assert.equal(cancel, 'eaa7e808fec1e6428fb9179aa9403209851d3c7ce4762e75f641ccf17dca0e4f');
    assert.equal(cancel, hmac(Buffer.from('cancel'), hex(pool), hex(orderId)));
    const creator = wallet.creatorSecret(settings);
    assert.equal(creator, 'cdc1f9772d90cccbc1d684e26b7daf1021281deac6cfbde0a5294409c8b1c0e1');
    assert.equal(
      creator,
      hmac(
        Buffer.from('pool-creator'),
        hex(settings.tokenA),
        hex(settings.tokenB),
        uint128(30n),
        hex(settings.orderBondToken),
        uint128(1000n),
      ),
    );
    assert.notEqual(wallet.cancelSecret(pool, 'ce'.repeat(32)), cancel);
    assert.notEqual(wallet.cancelSecret('ac'.repeat(32), orderId), cancel);
    assert.notEqual(wallet.creatorSecret({ ...settings, lpFeeBps: 31 }), creator);
  } finally {
    wallet.close();
  }
  const otherAccount = walletFromSeed({ seed: '00'.repeat(32), account: 1 });
  assert.notEqual(
    otherAccount.cancelSecret(pool, orderId),
    'eaa7e808fec1e6428fb9179aa9403209851d3c7ce4762e75f641ccf17dca0e4f',
  );
  otherAccount.close();
  assert.throws(() => wallet.cancelSecret(pool, orderId), /wallet_closed/);
});

test('a checkpoint must belong to the seed', () => {
  const owner = walletFromSeed({ seed: '00'.repeat(32) });
  const checkpoint = { network: 'mainnet', unshieldedAddressHex: owner.unshieldedAddressHex };
  owner.close();
  assert.ok(northstarsdk({ providers, seed: '00'.repeat(32), checkpoint }).addresses().unshielded);
  assert.throws(
    () => northstarsdk({ providers, seed: '11'.repeat(32), checkpoint }).addresses(),
    /checkpoint_address_mismatch/,
  );
  assert.throws(
    () => northstarsdk({ providers, seed: '00'.repeat(32), checkpoint: { network: 'mainnet' } }).addresses(),
    /checkpoint_address_required/,
  );
});

test('without a seed the SDK reads and quotes but refuses wallet work before any network use', async () => {
  const sdk = northstarsdk({ providers });
  assert.throws(() => sdk.addresses(), /seed_required/);
  for (const [method, options] of [
    ['buildSwapOrder', { pool, direction: 'AtoB', amountIn: 1000n, slippageBps: 50 }],
    ['buildLiquidityOrder', { pool, kind: 'add', amountA: 1n, amountB: 1n, minLp: 1n }],
    ['buildCancelOrder', { pool, orderId: '11'.repeat(32) }],
    ['buildCancelLiquidityOrder', { pool, orderId: '11'.repeat(32) }],
    ['buildPublicLiquiditySettlement', { pool, orderId: '11'.repeat(32) }],
    ['createPool', { tokenA: '01'.repeat(32), tokenB: '02'.repeat(32), orderBondToken: '01'.repeat(32) }],
    ['fundPool', { pool, amountA: 1n, amountB: 1n }],
    ['sync', {}],
  ])
    await assert.rejects(() => sdk[method](options), /seed_required/, method);
});

test('the SDK needs credential-free Mainnet providers', () => {
  assert.throws(() => northstarsdk({}), /providers_required/);
  assert.throws(
    () =>
      northstarsdk({ providers: { ...providers, indexer: 'https://midnight-mainnet.blockfrost.io/api/v0' } }),
    /blockfrost_needs_startProviderRelay/,
  );
});
