import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import { POOL_ADDRESS, buildPoolState, mainnetFetch } from './helpers/offline-pool.mjs';
import { providers } from './helpers/providers.mjs';

let served;
mock.method(globalThis, 'fetch', mainnetFetch(() => served).handler);
const { northstarsdk, NORTHSTAR_POOL_AUTHORITY } = await import('../dist/index.js');
const sdk = northstarsdk({ providers });
const funded = { reserveA: 1_000_000n, reserveB: 1_000_000n };

test('getPool shows who controls a pool and whether NorthStar settles it', async () => {
  served = await buildPoolState(funded);
  const test = await sdk.getPool(POOL_ADDRESS);
  assert.deepEqual(test.authority, {
    masterAuthId: '04'.repeat(32),
    batcherAuthIds: ['05'.repeat(32)],
    protocolFeeRecipient: '06'.repeat(32),
  });
  assert.equal(test.maintenanceLocked, true);
  assert.equal(test.servedByNorthStar, false);

  served = await buildPoolState({ ...funded, authority: NORTHSTAR_POOL_AUTHORITY });
  assert.equal((await sdk.getPool(POOL_ADDRESS)).servedByNorthStar, true);
});

test('a pool that can still be upgraded is never served, whoever runs it', async () => {
  served = await buildPoolState({ ...funded, authority: NORTHSTAR_POOL_AUTHORITY, maintenanceThreshold: 0 });
  const pool = await sdk.getPool(POOL_ADDRESS);
  assert.equal(pool.maintenanceLocked, false);
  assert.equal(pool.servedByNorthStar, false);
});
