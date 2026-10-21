import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  existsSync,
  writeFileSync,
  symlinkSync,
  mkdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const releaseId = 'northstar-amm-delayed-liquidity-2026-10-06-8e946cfa196a';
let chain = 1700000000n,
  receipt,
  decoded,
  submissions = 0;
class Call {
  constructor(address, entryPoint) {
    this.address = address;
    this.entryPoint = entryPoint;
  }
}
const ledger = await import('@midnight-ntwrk/ledger-v8');
mock.module('@midnight-ntwrk/ledger-v8', {
  exports: { ...ledger, ContractCall: Call, Transaction: { deserialize: () => decoded } },
});
mock.module('../dist/internal/chain-time.js', { exports: { readFinalizedChainTime: async () => chain } });
mock.module('../dist/transaction-builder.js', { exports: { readPool: async () => ({ releaseId }) } });
mock.module('../dist/internal/pool-state.js', {
  exports: {
    createReadProviders: () => ({
      publicDataProvider: { watchForTxData: async () => receipt, queryContractState: async () => ({}) },
    }),
  },
});
mock.module('../dist/internal/artifacts.js', {
  exports: {
    AMM_RELEASE_ID: releaseId,
    selectCompatibleRelease: () => ({
      releaseId,
      sourceSha256: '8e946cfa196ae3019802d3a9daa3b339f366549096358396acee8945b6e73f51',
    }),
  },
});
const { withDelayedSubmission, reconcileDelayedSubmission, resolveDelayedSubmission } = await import(
  '../dist/internal/delayed-submission.js'
);
const { providerEnvironment } = await import('../dist/internal/environment.js');
const { providers } = await import('./helpers/providers.mjs');
const environment = providerEnvironment(providers);
let journalDir = null;
const walletScope = 'ef'.repeat(32);
const submitWith = (transaction, submit) =>
  withDelayedSubmission({ order, environment, journalDir, walletScope, tx: transaction, submit });
const order = {
  built: {
    releaseId,
    sourceSha256: '8e946cfa196ae3019802d3a9daa3b339f366549096358396acee8945b6e73f51',
    compiledDir: 'synthetic',
    contractAddress: 'ab'.repeat(32),
    circuitId: 'liquidityOrder',
  },
  orderId: 'cd'.repeat(32),
  creationTimeUpperBound: String(chain + 240n),
  quote: {
    publicSettleAfter: String(chain + 240n + 2592061n),
    deadline: String(chain + 240n + 3456000n),
  },
};
const id = '00' + '12'.repeat(32),
  intent = '34'.repeat(32);
const tx = () => ({
  identifiers: () => [id],
  serialize: () => Uint8Array.of(1, 2, 3),
  intents: new Map([
    [
      42000,
      { actions: [new Call(order.built.contractAddress, order.built.circuitId)], intentHash: () => intent },
    ],
  ]),
});
const withDirectory = async (run) => {
  decoded = tx();
  const dir = mkdtempSync(path.join(tmpdir(), 'northstar-delayed-journal-'));
  journalDir = dir;
  try {
    await run(dir);
  } finally {
    journalDir = null;
    rmSync(dir, { recursive: true, force: true });
  }
};
test('exact bytes and action identity fsynced before submit; unknown blocks repeats', () =>
  withDirectory(async (dir) => {
    await assert.rejects(
      submitWith(tx(), async () => {
        submissions++;
        const files = readdirSync(dir);
        assert.equal(files.length, 1);
        const r = JSON.parse(readFileSync(path.join(dir, files[0])));
        assert.equal(r.transactionHex, '010203');
        assert.equal(r.state, 'submission-unknown');
        assert.equal(r.actionSegment, 42000);
        assert.equal(r.actionIntentHash, intent);
        assert.equal(r.walletScope, walletScope);
        throw Error('response lost');
      }),
      /do_not_rebroadcast/,
    );
    await assert.rejects(
      submitWith(tx(), async () => {
        submissions++;
      }),
      /journal_exists/,
    );
    assert.equal(submissions, 1);
  }));
test('stale admission and unexpected call fail before submit or journal', () =>
  withDirectory(async (dir) => {
    chain = 1700000300n;
    await assert.rejects(
      submitWith(tx(), async () => {
        throw Error('unexpected');
      }),
      /window_stale/,
    );
    chain = 1700000000n;
    const malformed = tx();
    malformed.intents.get(42000).actions.push(new Call('99'.repeat(32), 'settleOne'));
    await assert.rejects(
      submitWith(malformed, async () => {}),
      /action_mismatch/,
    );
    assert.equal(readdirSync(dir).length, 0);
  }));
test('known acceptance remains durable; reconciliation requires exact action identity', () =>
  withDirectory(async (dir) => {
    await submitWith(tx(), async () => ({ txId: id }));
    const file = path.join(dir, readdirSync(dir)[0]);
    assert.equal(JSON.parse(readFileSync(file)).state, 'accepted');
    decoded = tx();
    receipt = { identifiers: [id], tx: tx(), blockHash: '56'.repeat(32), status: 'SucceedEntirely' };
    assert.equal((await reconcileDelayedSubmission(file, environment)).record.txId, id);
    receipt.tx.intents.get(42000).intentHash = () => '88'.repeat(32);
    await assert.rejects(reconcileDelayedSubmission(file, environment), /action_mismatch/);
    await assert.rejects(
      submitWith(tx(), async () => {}),
      /journal_exists/,
    );
  }));

test('explicit resolution archives terminal failure and permits a newly built attempt; unknown cannot clear', () =>
  withDirectory(async (dir) => {
    await submitWith(tx(), async () => ({ txId: id }));
    let file = path.join(
      dir,
      readdirSync(dir).find((n) => n.endsWith('.json')),
    );
    decoded = tx();
    receipt = {
      identifiers: [id],
      tx: tx(),
      blockHash: '56'.repeat(32),
      status: 'pending',
      segmentStatusMap: new Map([[42000, 'SegmentFail']]),
    };
    await assert.rejects(resolveDelayedSubmission(file, environment), /not_terminal/);
    assert.ok(existsSync(file));
    receipt.status = 'FailEntirely';
    const resolved = await resolveDelayedSubmission(file, environment);
    assert.equal(resolved.outcome, 'failed');
    assert.ok(existsSync(resolved.archive));
    assert.equal(existsSync(file), false);
    await assert.rejects(
      submitWith(tx(), async () => {
        throw Error('unexpected rebroadcast');
      }),
      /archived_transaction/,
    );
    const original = JSON.parse(readFileSync(resolved.archive));
    assert.equal(original.transactionHex, '010203');
    assert.equal(original.txId, id);
    // Explicit new build/submit, never replay archived bytes. A new identifier is journaled.
    const newer = tx();
    const freshId = '00' + '78'.repeat(32);
    newer.identifiers = () => [freshId];
    decoded = newer;
    await submitWith(newer, async () => ({ txId: freshId }));
    assert.ok(existsSync(file));
    assert.equal(JSON.parse(readFileSync(file)).txId, freshId);
    assert.equal(JSON.parse(readFileSync(resolved.archive)).txId, id);
    receipt = { identifiers: [freshId], tx: newer, blockHash: '56'.repeat(32), status: 'SucceedEntirely' };
    const text = readFileSync(file, 'utf8');
    const altered = JSON.parse(text);
    altered.sourceSha256 = '00'.repeat(32);
    writeFileSync(file, JSON.stringify(altered));
    await assert.rejects(resolveDelayedSubmission(file, environment), /release_mismatch/);
    assert.ok(existsSync(file));
    writeFileSync(file, text);
    receipt.tx.intents.get(42000).intentHash = () => '88'.repeat(32);
    await assert.rejects(resolveDelayedSubmission(file, environment), /action_mismatch/);
    assert.ok(existsSync(file));
  }));

test('archive directory symlink refuses before unintended writes', () =>
  withDirectory(async (dir) => {
    decoded = tx();
    await submitWith(tx(), async () => ({ txId: id }));
    const file = path.join(
      dir,
      readdirSync(dir).find((n) => n.endsWith('.json')),
    );
    receipt = { identifiers: [id], tx: tx(), blockHash: '56'.repeat(32), status: 'FailEntirely' };
    const other = path.join(dir, 'other');
    mkdirSync(other);
    symlinkSync(other, file + '.resolved');
    await assert.rejects(resolveDelayedSubmission(file, environment), /unsafe_archive_directory/);
    assert.ok(existsSync(file));
    assert.equal(readdirSync(other).length, 0);
  }));

test('without a journal folder nothing is written, but the timing check still runs first', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'northstar-no-journal-'));
  const cwd = process.cwd();
  process.chdir(dir);
  try {
    let sent = 0;
    assert.deepEqual(
      await submitWith(tx(), async () => {
        sent++;
        return { txId: id };
      }),
      { txId: id },
    );
    chain = 1700000300n;
    await assert.rejects(
      submitWith(tx(), async () => {
        sent++;
      }),
      /window_stale/,
    );
    assert.equal(sent, 1);
    assert.deepEqual(readdirSync(dir), []);
  } finally {
    chain = 1700000000n;
    process.chdir(cwd);
    rmSync(dir, { recursive: true, force: true });
  }
});
