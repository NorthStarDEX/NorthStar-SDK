import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { after, mock } from 'node:test';
import * as contracts from '@midnight-ntwrk/midnight-js-contracts';
import { POOL_ADDRESS, buildPoolState, mainnetFetch, poolLedger } from './helpers/offline-pool.mjs';
import { providers } from './helpers/providers.mjs';

// The real SDK path: northstarsdk -> buildSwap -> buildDepositOrderTx -> the
// compiled depositOrder circuit. Only the network is replaced: `fetch` serves
// an offline pool. createUnprovenCallTx runs unchanged; the wrapper records
// what the circuit wrote.
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
const empty = await buildPoolState();
let served = funded;
const network = mainnetFetch(() => served);
mock.method(globalThis, 'fetch', network.handler);

// Run from an empty folder to show the SDK writes nothing where it runs.
const workdir = realpathSync(mkdtempSync(path.join(tmpdir(), 'northstar-cwd-')));
const originalCwd = process.cwd();
process.chdir(workdir);
after(() => {
  process.chdir(originalCwd);
  rmSync(workdir, { recursive: true, force: true });
});

const { northstarsdk } = await import('../dist/index.js');
const sdk = northstarsdk({ providers, seed: '11'.repeat(32) });
const swap = { pool: POOL_ADDRESS, amountIn: 20_000n };

// The order exactly as depositOrder writes it into the pool's order book.
const storedOrder = (orderId) => {
  const { options, result } = circuitCalls.at(-1);
  assert.equal(options.circuitId, 'depositOrder');
  assert.equal(Buffer.from(options.args[0]).toString('hex'), orderId);
  return poolLedger(result.public.nextContractState).orderBook.lookup(options.args[0]);
};

test('slippageBps sets the minimum the depositOrder circuit stores, matching the quote', async () => {
  // 20,000 in, 0.3% fee, reserves 100M A / 200M B. 1% slippage below the quote.
  for (const [direction, value, quotedOut, minimum] of [
    ['AtoB', 0, '39872', 39_473n],
    ['BtoA', 1, '9969', 9_869n],
  ]) {
    const quote = await sdk.quoteSwapOrder({ ...swap, direction, slippageBps: 100 });
    assert.equal(quote.expectedOut, quotedOut);
    assert.equal(quote.minAmountOut, String(minimum));
    const order = await sdk.buildSwapOrder({ ...swap, direction, slippageBps: 100 });
    const stored = storedOrder(order.orderId);
    assert.equal(stored.direction, value);
    assert.equal(stored.amountIn, 20_000n);
    assert.equal(stored.minAmountOut, minimum);
  }
});

test('an explicit minAmountOut reaches the circuit unchanged', async () => {
  const order = await sdk.buildSwapOrder({ ...swap, direction: 'AtoB', minAmountOut: 39_000n });
  assert.equal(storedOrder(order.orderId).minAmountOut, 39_000n);
});

test('a swap without a valid direction and price limit fails before any network read', async () => {
  const requests = network.requests.length;
  const circuits = circuitCalls.length;
  for (const [options, error] of [
    [{ ...swap, direction: 'AtoB' }, /min_amount_out_or_slippage_bps_required/],
    [{ ...swap, direction: 'AtoB', minAmountOut: 1n, slippageBps: 100 }, /both_set/],
    [{ ...swap, direction: 'AtoB', slippageBps: 10_001 }, /slippage_bps_out_of_range/],
    [{ ...swap, direction: 'AtoB', slippageBps: -1 }, /slippage_bps_out_of_range/],
    [{ ...swap, direction: 'AtoB', minAmountOut: 0n }, /min_amount_out_out_of_range/],
    [{ ...swap, slippageBps: 100 }, /swap_direction_must_be_AtoB_or_BtoA/],
    [{ ...swap, direction: 'buy', slippageBps: 100 }, /swap_direction_must_be_AtoB_or_BtoA/],
    [{ ...swap, direction: 'atob', slippageBps: 100 }, /swap_direction_must_be_AtoB_or_BtoA/],
  ]) {
    await assert.rejects(() => sdk.quoteSwapOrder(options), error);
    await assert.rejects(() => sdk.buildSwapOrder(options), error);
  }
  assert.equal(network.requests.length, requests);
  assert.equal(circuitCalls.length, circuits);
});

test('slippage needs a live quote: an empty pool is refused before the circuit runs', async () => {
  served = empty;
  try {
    const circuits = circuitCalls.length;
    await assert.rejects(
      () => sdk.buildSwapOrder({ ...swap, direction: 'AtoB', slippageBps: 100 }),
      /swap_quote_unavailable:pool_has_no_liquidity/,
    );
    assert.equal(circuitCalls.length, circuits);
  } finally {
    served = funded;
  }
});

test('building orders and quotes writes no files in the working directory', () => {
  assert.ok(circuitCalls.length > 0);
  assert.deepEqual(readdirSync(workdir), []);
});
