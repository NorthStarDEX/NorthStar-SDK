import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  CostModel,
  createCheckPayload,
  createProvingPayload,
  parseCheckResult,
  type ProvingKeyMaterial,
  type ProvingProvider,
  type UnprovenTransaction,
} from '@midnight-ntwrk/ledger-v8';
import { assertAuditedArtifacts, DEFAULT_COMPILED_DIR, PROVING_CIRCUITS } from './artifacts.js';

const BUILTIN_KEYS = new Set([
  'midnight/zswap/spend',
  'midnight/zswap/output',
  'midnight/zswap/sign',
  'midnight/dust/spend',
]);

/** Sends the bundled AMM keys with each request to a standard proof server. */
export const createAmmProvingProvider = (
  serverUrl: string,
  compiledDir = DEFAULT_COMPILED_DIR,
): ProvingProvider => {
  const base = new URL(serverUrl);
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('proof_server_protocol_unsupported');
  const release = assertAuditedArtifacts(compiledDir);
  const keyMaterial = (keyLocation: string): ProvingKeyMaterial | undefined => {
    if (BUILTIN_KEYS.has(keyLocation)) return undefined;
    if (!release.releaseCircuits.includes(keyLocation))
      throw new Error(`amm_proof_circuit_unsupported:${keyLocation}`);
    if (!PROVING_CIRCUITS.includes(keyLocation))
      throw new Error(`amm_proof_circuit_not_bundled:${keyLocation}`);
    // Recheck the bundle before every proof.
    const current = assertAuditedArtifacts(release.compiledDir);
    if (current.releaseId !== release.releaseId) throw new Error('amm_proof_directory_release_changed');
    return {
      ir: readFileSync(path.join(release.compiledDir, 'zkir', `${keyLocation}.bzkir`)),
      proverKey: readFileSync(path.join(release.compiledDir, 'keys', `${keyLocation}.prover`)),
      verifierKey: readFileSync(path.join(release.compiledDir, 'keys', `${keyLocation}.verifier`)),
    };
  };
  const request = async (suffix: string, payload: Uint8Array): Promise<Uint8Array> => {
    const url = new URL(base);
    url.pathname = url.pathname.replace(/\/$/u, '') + suffix;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: new Uint8Array(payload),
      signal: AbortSignal.timeout(300_000),
    });
    if (!response.ok) throw new Error(`amm_proof_server_http_${response.status}:${suffix}`);
    return new Uint8Array(await response.arrayBuffer());
  };
  return {
    check: async (preimage, keyLocation) =>
      parseCheckResult(await request('/check', createCheckPayload(preimage, keyMaterial(keyLocation)?.ir))),
    prove: async (preimage, keyLocation, overwriteBindingInput) =>
      request('/prove', createProvingPayload(preimage, overwriteBindingInput, keyMaterial(keyLocation))),
  };
};

export const createAmmProvingService = (serverUrl: string, compiledDir = DEFAULT_COMPILED_DIR) => {
  const provider = createAmmProvingProvider(serverUrl, compiledDir);
  return {
    prove: (transaction: UnprovenTransaction) => transaction.prove(provider, CostModel.initialCostModel()),
  };
};
