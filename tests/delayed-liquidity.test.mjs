import assert from 'node:assert/strict';
import { existsSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import {
  APPROVED_AMM_RELEASES,
  assertAuditedArtifacts,
  selectCompatibleRelease,
} from '../dist/internal/artifacts.js';
import {
  liquidityAdmissionTiming,
  requireLiquidityAdmissionWindow,
  publicLiquidityState,
  PUBLIC_LIQUIDITY_DELAY_SECONDS,
} from '../dist/internal/liquidity-timing.js';
import { decodeRecentChainTime } from '../dist/internal/chain-time.js';
const stateFor = (release) => ({
  operations: () => assertAuditedArtifacts(release.compiledDir).releaseCircuits,
  operation: (name) => ({
    verifierKey: readFileSync(path.join(release.compiledDir, 'keys', name + '.verifier')),
  }),
});
test('all eleven pins select the only decoder, mixed changed key is refused', () => {
  assert.equal(APPROVED_AMM_RELEASES.length, 1);
  for (const release of APPROVED_AMM_RELEASES)
    assert.equal(selectCompatibleRelease(stateFor(release)).releaseId, release.releaseId);
  const newRelease = APPROVED_AMM_RELEASES[0];
  const state = stateFor(newRelease),
    operation = state.operation;
  state.operation = (n) => (n === 'liquidityOrder' ? { verifierKey: Uint8Array.of(1, 2, 3) } : operation(n));
  assert.throws(() => selectCompatibleRelease(state), /release_unsupported/);
});
test('uniform fixed delay, separate client expiry and exact E boundary', () => {
  const chain = 1_700_000_000n,
    t = liquidityAdmissionTiming(chain);
  assert.equal(t.creationTimeUpperBound - chain, 240n);
  assert.equal(t.publicSettleAfter - t.creationTimeUpperBound, PUBLIC_LIQUIDITY_DELAY_SECONDS);
  assert.throws(() => liquidityAdmissionTiming(chain, 21 * 86400), /expiry_out_of_range/);
  assert.throws(() => liquidityAdmissionTiming(chain, 60 * 86400), /expiry_out_of_range/);
  requireLiquidityAdmissionWindow(chain + 200n, t.creationTimeUpperBound, t.deadline);
  assert.throws(
    () => requireLiquidityAdmissionWindow(chain + 211n, t.creationTimeUpperBound, t.deadline),
    /window_stale/,
  );
  const order = { direction: 3, deadline: t.deadline, publicSettleAfter: t.publicSettleAfter };
  assert.equal(publicLiquidityState(order, t.publicSettleAfter - 1n), 'waiting');
  assert.equal(publicLiquidityState(order, t.publicSettleAfter), 'mature');
  assert.equal(publicLiquidityState(order, t.deadline), 'mature');
  assert.equal(publicLiquidityState(order, t.deadline + 1n), 'expired');
  assert.equal(
    publicLiquidityState({ ...order, direction: 0, publicSettleAfter: 0n }, t.deadline),
    'not-liquidity',
  );
});
test('canonical timestamp rejects stale, future, missing, malformed and local-time fallback', () => {
  const encode = (n) => {
    const b = Buffer.alloc(8);
    b.writeBigUInt64LE(BigInt(n));
    return '0x' + b.toString('hex');
  };
  const now = Date.now();
  assert.equal(decodeRecentChainTime(encode(now), now), BigInt(Math.floor(now / 1000)));
  for (const x of [encode(now - 60001), encode(now + 30001), null, '0x00'])
    assert.throws(() => decodeRecentChainTime(x, now), /timestamp/);
});
test('candidate exact artifact files and public decoder field are retained', () => {
  const release = APPROVED_AMM_RELEASES[0];
  const manifest = JSON.parse(readFileSync(path.join(release.compiledDir, 'release.json')));
  assert.equal(Object.keys(manifest.files).length, 32);
  assert.equal(manifest.distribution, 'public-user-subset');
  for (const c of [
    'settleOne',
    'settleBatchUpTo5',
    'setBatcherAuthorization',
    'setProtocolFeeConfig',
    'claimProtocolFees',
  ]) {
    for (const f of [`keys/${c}.prover`, `zkir/${c}.zkir`, `zkir/${c}.bzkir`]) {
      assert.equal(f in manifest.files, false, f);
      assert.equal(existsSync(path.join(release.compiledDir, f)), false, f);
    }
    assert.ok(`keys/${c}.verifier` in manifest.files, c);
  }
  assert.equal(existsSync(path.join(release.compiledDir, 'contract/index.js.map')), false);
  const types = readFileSync(path.join(release.compiledDir, 'contract/index.d.ts'), 'utf8');
  assert.match(types, /publicSettleAfter: bigint/);
  assert.match(types, /creationTimeUpperBound_0: bigint|creationTimeUpperBound.*bigint/);
});
