import assert from 'node:assert/strict';
import test from 'node:test';
import { waitForIndexedTransaction } from '../dist/runtime.js';

const INDEXER = 'http://127.0.0.1:9/indexer';
const HASH = 'ab'.repeat(32);

const fakeIndexer = (answers) => {
  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    const answer = answers.shift() ?? 'empty';
    if (answer === 'down') throw new Error('connection refused');
    return Response.json({ data: { transactions: answer === 'listed' ? [{ hash: HASH }] : [] } });
  };
  return requests;
};

test('submit returns once the indexer lists the transaction, retrying through network errors', async () => {
  const requests = fakeIndexer(['empty', 'down', 'listed']);
  assert.equal(await waitForIndexedTransaction(INDEXER, HASH, { pollMs: 1 }), true);
  assert.equal(requests.length, 3);
  assert.equal(requests[0].url, INDEXER);
  assert.match(requests[0].body.query, new RegExp(`hash: "${HASH}"`, 'u'));
});

test('a transaction the indexer never lists is reported after the time limit, not thrown', async () => {
  fakeIndexer([]);
  const start = Date.now();
  assert.equal(await waitForIndexedTransaction(INDEXER, HASH, { timeoutMs: 50, pollMs: 10 }), false);
  assert.ok(Date.now() - start < 1_000);
});
