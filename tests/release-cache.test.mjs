import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  assertAuditedArtifacts,
  DEFAULT_COMPILED_DIR,
  loadCompiledModule,
} from '../dist/internal/artifacts.js';

test('a cached decoder cannot bypass altered bytes or an unsupported release manifest', async () => {
  // Keep the temporary import under this package so its pinned runtime resolves.
  // Importing the generated module does not execute a constructor or circuit.
  const temporary = mkdtempSync(path.join(fileURLToPath(new URL('.', import.meta.url)), '.release-cache-'));
  const bundle = path.join(temporary, 'bundle');
  try {
    cpSync(DEFAULT_COMPILED_DIR, bundle, { recursive: true });
    const first = await loadCompiledModule(bundle);
    assert.equal(await loadCompiledModule(bundle), first);
    const contractPath = path.join(bundle, 'contract', 'index.js');
    const originalContract = readFileSync(contractPath);
    writeFileSync(contractPath, Buffer.concat([originalContract, Buffer.from('\n// fixture alteration')]));
    await assert.rejects(loadCompiledModule(bundle), /compiled_artifact_hash_mismatch/);
    writeFileSync(contractPath, originalContract);
    assert.equal(await loadCompiledModule(bundle), first);
    const manifestPath = path.join(bundle, 'release.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.sourceSha256 = '479c614eeafa2d852e78ebf7f5d9c096a41fa44d4bc5af826f2ea28e9120da43';
    writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => assertAuditedArtifacts(bundle), /compiled_artifact_release_manifest_mismatch/);
    await assert.rejects(loadCompiledModule(bundle), /compiled_artifact_release_manifest_mismatch/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
