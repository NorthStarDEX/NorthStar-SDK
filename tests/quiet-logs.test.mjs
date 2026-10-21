import assert from 'node:assert/strict';
import test from 'node:test';

const printed = [];
console.error = (...args) => printed.push(args);
const { quietWalletLogs, lastWalletReconnect } = await import('../dist/internal/quiet-logs.js');
const { waitForWalletSync } = await import('../dist/runtime.js');

const NODE = 'ws://127.0.0.1:44271/rpc';
const disconnect = (url) => [
  '2026-10-21 12:11:33',
  '       RPC-CORE:',
  `subscribeRuntimeVersion(): RuntimeVersion:: disconnected from ${url}: 1000:: Normal Closure`,
];

test('wallet reconnects and the wallet closing its own node connection stay out of the console', () => {
  quietWalletLogs(NODE);
  console.error(Object.assign(new Error('[object CloseEvent]'), { _tag: 'Wallet.Sync' }));
  console.error(...disconnect(NODE));
  assert.deepEqual(printed, []);
  assert.equal(lastWalletReconnect(), 'indexer_connection_closed');

  // Everything else still prints: other nodes, other wallet errors, plain messages.
  console.error(...disconnect('ws://another-node/rpc'));
  console.error('Error processing tx history metadata', new Error('bad metadata'));
  console.error(Object.assign(new Error('other'), { _tag: 'Wallet.Other' }));
  assert.equal(printed.length, 3);
});

test('a wallet that cannot catch up fails with the last reconnect reason', async () => {
  quietWalletLogs(NODE);
  console.error(Object.assign(new Error('[object ErrorEvent]'), { _tag: 'Wallet.Sync' }));
  const facade = { waitForSyncedState: () => new Promise(() => {}) };
  await assert.rejects(
    () => waitForWalletSync(facade, { timeoutMs: 10 }),
    /^Error: wallet_sync_timeout:10:indexer_connection_error$/u,
  );
});
