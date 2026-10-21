import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import test, { mock } from 'node:test';
import path from 'node:path';
import { DEFAULT_COMPILED_DIR } from '../dist/internal/artifacts.js';
const records = [];
mock.module('@midnight-ntwrk/ledger-v8', {
  exports: {
    CostModel: { initialCostModel: () => 'cost-model' },
    createCheckPayload: (preimage, ir) => {
      records.push({ type: 'check', preimage, ir });
      return Uint8Array.of(1);
    },
    createProvingPayload: (preimage, binding, material) => {
      records.push({ type: 'prove', preimage, binding, material });
      return Uint8Array.of(2);
    },
    parseCheckResult: () => [7n],
  },
});
const { createAmmProvingProvider, createAmmProvingService } = await import(
  '../dist/internal/proof-provider.js'
);
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('custom AMM proofs send unchanged final release bytes to the configured server', async (t) => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url: String(url), options });
    return new Response(Uint8Array.of(3));
  });
  records.length = 0;
  const provider = createAmmProvingProvider('http://127.0.0.1:6400/base/');
  assert.deepEqual(await provider.check(Uint8Array.of(8), 'depositOrder'), [7n]);
  assert.deepEqual(await provider.prove(Uint8Array.of(8), 'depositOrder', 9n), Uint8Array.of(3));
  assert.equal(requests[0].url, 'http://127.0.0.1:6400/base/check');
  assert.equal(requests[1].url, 'http://127.0.0.1:6400/base/prove');
  const check = records.find((record) => record.type === 'check');
  const prove = records.find((record) => record.type === 'prove');
  for (const [key, relative] of [
    ['ir', 'zkir/depositOrder.bzkir'],
    ['proverKey', 'keys/depositOrder.prover'],
    ['verifierKey', 'keys/depositOrder.verifier'],
  ]) {
    assert.equal(
      digest(prove.material[key]),
      digest(readFileSync(path.join(DEFAULT_COMPILED_DIR, relative))),
    );
  }
  assert.equal(digest(check.ir), digest(prove.material.ir));
  assert.equal(prove.binding, 9n);
});

test('changed material after provider creation is rejected before proof transport', async (t) => {
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    requests += 1;
    return new Response(Uint8Array.of(3));
  });
  const directory = mkdtempSync(path.join(tmpdir(), 'northstar-proof-pins-'));
  try {
    cpSync(DEFAULT_COMPILED_DIR, directory, { recursive: true });
    const provider = createAmmProvingProvider('http://127.0.0.1:6400', directory);
    writeFileSync(path.join(directory, 'keys', 'depositOrder.verifier'), Uint8Array.of(1, 2, 3));
    await assert.rejects(
      () => provider.prove(Uint8Array.of(8), 'depositOrder'),
      /compiled_artifact_hash_mismatch/,
    );
    assert.equal(requests, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('replacing a provider manifest with an unsupported release fails before proof transport', async (t) => {
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    requests += 1;
    return new Response(Uint8Array.of(3));
  });
  const directory = mkdtempSync(path.join(tmpdir(), 'northstar-proof-release-'));
  try {
    cpSync(DEFAULT_COMPILED_DIR, directory, { recursive: true });
    const provider = createAmmProvingProvider('http://127.0.0.1:6400', directory);
    const manifestPath = path.join(directory, 'release.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.sourceSha256 = '479c614eeafa2d852e78ebf7f5d9c096a41fa44d4bc5af826f2ea28e9120da43';
    writeFileSync(manifestPath, JSON.stringify(manifest));
    await assert.rejects(
      () => provider.prove(Uint8Array.of(8), 'depositOrder'),
      /compiled_artifact_release_manifest_mismatch/,
    );
    assert.equal(requests, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('builtin proofs rely on builtin server keys; unknown and traversal names fail before network', async (t) => {
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    requests += 1;
    return new Response(Uint8Array.of(3));
  });
  const provider = createAmmProvingProvider('http://127.0.0.1:6400');
  await provider.prove(Uint8Array.of(8), 'midnight/dust/spend');
  assert.equal(records.at(-1).material, undefined);
  for (const name of ['foreignCircuit', '../depositOrder', 'other/depositOrder']) {
    await assert.rejects(() => provider.prove(Uint8Array.of(8), name), /amm_proof_circuit_unsupported/);
  }
  assert.equal(requests, 1);
});

test('proof service uses the installed ledger transaction prove API and propagates server failures', async (t) => {
  const service = createAmmProvingService('http://127.0.0.1:6400');
  const proven = {};
  assert.equal(
    await service.prove({
      prove: async (provider, model) => {
        assert.equal(typeof provider.check, 'function');
        assert.equal(model, 'cost-model');
        return proven;
      },
    }),
    proven,
  );
  t.mock.method(globalThis, 'fetch', async () => new Response('Unavailable', { status: 503 }));
  await assert.rejects(
    () => createAmmProvingProvider('http://127.0.0.1:6400').prove(Uint8Array.of(8), 'depositOrder'),
    /amm_proof_server_http_503/,
  );
  assert.throws(() => createAmmProvingProvider('file:///tmp/prover'), /proof_server_protocol_unsupported/);
});

test('batcher and admin circuits have no bundled proving material', async (t) => {
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    requests += 1;
    return new Response(Uint8Array.of(3));
  });
  const provider = createAmmProvingProvider('http://127.0.0.1:6400');
  for (const circuit of [
    'settleOne',
    'settleBatchUpTo5',
    'setBatcherAuthorization',
    'setProtocolFeeConfig',
    'claimProtocolFees',
  ]) {
    await assert.rejects(
      () => provider.prove(Uint8Array.of(8), circuit),
      new RegExp(`amm_proof_circuit_not_bundled:${circuit}`),
    );
  }
  assert.ok(await provider.prove(Uint8Array.of(8), 'settleLiquidityOrder'));
  assert.ok(await provider.prove(Uint8Array.of(8), 'depositLiquidity'));
  assert.equal(requests, 2);
});
