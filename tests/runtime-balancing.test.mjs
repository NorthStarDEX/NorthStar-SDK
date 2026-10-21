import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { Intent, Transaction } from '@midnight-ntwrk/ledger-v8';
import { balanceProvenTransaction, transactionHashOf } from '../dist/runtime.js';

const checkBalance = async ({
  fee = 0n,
  imbalances = new Map(),
  omitImbalances = false,
  segmentImbalances,
} = {}) => {
  const calls = [];
  const actor = {
    intents: new Map([
      [1, {}],
      [9, {}],
    ]),
    ...(!omitImbalances && {
      imbalances: (segment, fees) => {
        calls.push(['imbalance', segment, fees]);
        return segmentImbalances?.[segment] ?? imbalances;
      },
    }),
  };
  const finalDust = {};
  let finalized = 0;
  const facade = {
    balanceUnboundTransaction: async (...args) => {
      calls.push(['actor', ...args]);
      return 'actor-recipe';
    },
    balanceFinalizedTransaction: async (...args) => {
      calls.push(['dust', ...args]);
      return 'dust-recipe';
    },
    signRecipe: async (recipe, sign) => {
      sign(Uint8Array.of(1));
      return recipe;
    },
    finalizeRecipe: async () => (++finalized === 1 ? actor : finalDust),
    calculateTransactionFee: async (tx) => {
      assert.equal(tx, actor);
      return fee;
    },
  };
  const result = await balanceProvenTransaction({
    facade,
    provenTx: {},
    shieldedSecretKeys: {},
    dustSecretKey: {},
    unshieldedKeyStore: { signData: () => 'signature' },
  });
  return { calls, result, actor, finalDust };
};

test('zero-fee balanced actor stays unchanged and does not add empty DUST actions', async () => {
  const { result, actor, calls } = await checkBalance();
  assert.equal(result, actor);
  assert.equal(calls.filter(([kind]) => kind === 'dust').length, 0);
  assert.deepEqual(
    calls.filter(([kind]) => kind === 'imbalance').map(([, segment]) => segment),
    [0, 1, 9],
  );
  assert.deepEqual(calls[0][3].tokenKindsToBalance, ['shielded', 'unshielded']);
});

test('nonzero fees keep normal DUST balancing', async () => {
  const { result, finalDust, calls } = await checkBalance({ fee: 1n });
  assert.equal(result, finalDust);
  assert.equal(calls.filter(([kind]) => kind === 'dust').length, 1);
  assert.deepEqual(calls.find(([kind]) => kind === 'dust')[3].tokenKindsToBalance, ['dust']);
});

test('zero fees cannot skip a positive or negative token imbalance in any segment', async () => {
  for (const value of [-1n, 1n]) {
    const { result, finalDust, calls } = await checkBalance({
      segmentImbalances: { 9: new Map([['token', value]]) },
    });
    assert.equal(result, finalDust);
    assert.equal(calls.filter(([kind]) => kind === 'dust').length, 1);
  }
});

test('missing imbalance introspection keeps normal DUST balancing', async () => {
  const { result, finalDust } = await checkBalance({ omitImbalances: true });
  assert.equal(result, finalDust);
});

test('submit results use the ledger transaction hash that explorers and indexers show', () => {
  // A real Mainnet cancelOrder transaction and the hash the indexer lists for it.
  const raw = readFileSync(new URL('./fixtures/mainnet-cancel-order-tx.hex', import.meta.url), 'utf8').trim();
  const tx = Transaction.deserialize('signature', 'proof', 'binding', Buffer.from(raw, 'hex'));
  assert.equal(transactionHashOf(tx), '07e4b52c556a28dbc050d253e1a217d3240f590bb6ab882270354ddebfbc0dc6');
  const unproven = Transaction.fromParts(
    'mainnet',
    undefined,
    undefined,
    Intent.new(new Date(Date.now() + 600_000)),
  );
  for (const value of [unproven, {}, { transactionHash: () => `0x${'ab'.repeat(32)}` }])
    assert.throws(() => transactionHashOf(value), /transaction_hash_unavailable/u);
});
