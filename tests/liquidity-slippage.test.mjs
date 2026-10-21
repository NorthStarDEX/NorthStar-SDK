import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import * as contracts from '@midnight-ntwrk/midnight-js-contracts';
import { POOL_ADDRESS, buildPoolState, mainnetFetch, poolLedger } from './helpers/offline-pool.mjs';
import { providers } from './helpers/providers.mjs';

// The real SDK path: northstarsdk -> buildLiquidityOrderTx -> the compiled
// liquidityOrder circuit. Only the network is replaced: `fetch` serves an
// offline pool. The wrapper records what the circuit wrote.
const circuitCalls = [];
mock.module('@midnight-ntwrk/midnight-js-contracts', {
  exports: {
    ...contracts,
    createUnprovenCallTx: async (callProviders, options) => {
      const result = await contracts.createUnprovenCallTx(callProviders, options);
      circuitCalls.push({ options, result });
      return result;
    },
  },
});

const funded = await buildPoolState({ reserveA: 100_000_000n, reserveB: 200_000_000n });
const network = mainnetFetch(() => funded);
mock.method(globalThis, 'fetch', network.handler);

const { northstarsdk } = await import('../dist/index.js');
const sdk = northstarsdk({ providers, seed: '11'.repeat(32) });
const onePercentBelow = (amount) => (BigInt(amount) * 9_900n) / 10_000n;

// The order exactly as liquidityOrder writes it into the pool's order book.
const storedOrder = (orderId) => {
  const { options, result } = circuitCalls.at(-1);
  assert.equal(options.circuitId, 'liquidityOrder');
  assert.equal(Buffer.from(options.args[0]).toString('hex'), orderId);
  return poolLedger(result.public.nextContractState).orderBook.lookup(options.args[0]);
};

test('slippageBps on an add sets minLp 1% below the quoted LP, and the circuit stores it', async () => {
  const terms = {
    pool: POOL_ADDRESS,
    kind: 'add',
    amountA: 1_000_000n,
    amountB: 2_000_000n,
    slippageBps: 100,
  };
  const quote = await sdk.quoteLiquidityOrder(terms);
  assert.equal(quote.minLp, String(onePercentBelow(quote.expectedLp)));
  const order = await sdk.buildLiquidityOrder(terms);
  assert.equal(order.quote.minLp, quote.minLp);
  const stored = storedOrder(order.orderId);
  assert.equal(stored.amountIn, 1_000_000n);
  assert.equal(stored.amountAux, 2_000_000n);
  assert.equal(stored.minAmountOut, BigInt(quote.minLp));
});

test('slippageBps on a remove sets minA and minB 1% below the quoted outputs', async () => {
  const terms = { pool: POOL_ADDRESS, kind: 'remove', lp: 1_000_000n, slippageBps: 100 };
  const quote = await sdk.quoteLiquidityOrder(terms);
  assert.equal(quote.minA, String(onePercentBelow(quote.expectedA)));
  assert.equal(quote.minB, String(onePercentBelow(quote.expectedB)));
  const order = await sdk.buildLiquidityOrder(terms);
  const stored = storedOrder(order.orderId);
  assert.equal(stored.amountIn, 1_000_000n);
  assert.equal(stored.amountAux, BigInt(order.quote.minA));
  assert.equal(stored.minAmountOut, BigInt(order.quote.minB));
});

test('explicit minimums reach the circuit unchanged', async () => {
  const order = await sdk.buildLiquidityOrder({
    pool: POOL_ADDRESS,
    kind: 'add',
    amountA: 1_000_000n,
    amountB: 2_000_000n,
    minLp: 5n,
  });
  assert.equal(storedOrder(order.orderId).minAmountOut, 5n);
});

test('a liquidity order needs its minimums or slippageBps, never both, before any network read', async () => {
  const before = network.requests.length;
  for (const [terms, error] of [
    [{ kind: 'add', amountA: 1n, amountB: 1n }, /min_lp_or_slippage_bps_required/u],
    [
      { kind: 'add', amountA: 1n, amountB: 1n, minLp: 1n, slippageBps: 100 },
      /min_lp_and_slippage_bps_both_set/u,
    ],
    [{ kind: 'remove', lp: 1n }, /min_a_and_min_b_or_slippage_bps_required/u],
    [{ kind: 'remove', lp: 1n, minA: 1n }, /min_a_and_min_b_go_together/u],
    [
      { kind: 'remove', lp: 1n, minA: 0n, minB: 0n, slippageBps: 100 },
      /min_a_and_min_b_and_slippage_bps_both_set/u,
    ],
  ]) {
    await assert.rejects(() => sdk.quoteLiquidityOrder({ pool: POOL_ADDRESS, ...terms }), error);
    await assert.rejects(() => sdk.buildLiquidityOrder({ pool: POOL_ADDRESS, ...terms }), error);
  }
  assert.equal(network.requests.length, before);
});
