import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { projectPath, sha256File } from './common.js';
import type { UnknownRecord } from './types.js';

export const COMPACT_COMPILER_VERSION = '0.31.1';
export const COMPACT_LANGUAGE_VERSION = '0.23.0';
export const COMPACT_RUNTIME_VERSION = '0.16.0';

// midnight-js-contracts runs circuits through compact-js, which pins its own
// compact-runtime. It must load the same copy as the contract, or states and
// proofs mix two runtimes. npm applies `overrides` only in the root project,
// so the README lists the overrides an app needs.
export const compactRuntimeCopies = (): string[] => {
  const require = createRequire(import.meta.url);
  const compactJs = createRequire(require.resolve('@midnight-ntwrk/compact-js/package.json'));
  return [
    require.resolve('@midnight-ntwrk/compact-runtime'),
    compactJs.resolve('@midnight-ntwrk/compact-runtime'),
  ];
};

export const assertSingleCompactRuntime = (copies = compactRuntimeCopies()): void => {
  if (new Set(copies).size !== 1)
    throw new Error('midnight_runtime_duplicated:add_the_overrides_from_the_README');
};
export const DEFAULT_COMPILED_DIR = projectPath('artifacts', 'NorthStarDEX');

export const USER_ACTION_CIRCUITS = Object.freeze([
  'depositOrder',
  'cancelOrder',
  'liquidityOrder',
  'cancelLiquidityOrder',
]);

export const AMM_RELEASE_ID = 'northstar-amm-delayed-liquidity-2026-10-06-8e946cfa196a';
export const AMM_SOURCE_SHA256 = '8e946cfa196ae3019802d3a9daa3b339f366549096358396acee8945b6e73f51';
// Only the 2026-10-06 delayed-liquidity release is supported. Pools from any
// earlier release are rejected before their state is decoded.
export const APPROVED_AMM_RELEASES = Object.freeze([
  Object.freeze({
    orderSchemaVersion: 2,
    publicLiquiditySettlement: true,
    releaseId: AMM_RELEASE_ID,
    sourceSha256: AMM_SOURCE_SHA256,
    compiledDir: DEFAULT_COMPILED_DIR,
    manifestSha256: 'sha256:333d52211583201ec90b145a882b12d1ab15f34c995e7b56f7e164e5f967c370',
  }),
]);

export const resolveAmmRelease = (releaseId = AMM_RELEASE_ID) => {
  const release = APPROVED_AMM_RELEASES.find((entry) => entry.releaseId === releaseId);
  if (release == null) throw new Error(`amm_release_unsupported:${releaseId}`);
  return release;
};
const REQUIRED_ARTIFACT_CIRCUITS = Object.freeze([
  ...USER_ACTION_CIRCUITS,
  'depositLiquidity',
  'setBatcherAuthorization',
  'setProtocolFeeConfig',
  'claimProtocolFees',
  'settleLiquidityOrder',
  'settleOne',
  'settleBatchUpTo5',
]);

type ContractInfo = UnknownRecord & {
  'compiler-version'?: string;
  'language-version'?: string;
  'runtime-version'?: string;
  circuits?: Array<{ name: string }>;
  witnesses?: Array<{ name: string }>;
};

// The bundle ships proving material only for circuits an SDK user can prove:
// the four order actions, mature public liquidity settlement and the pool
// creator's one-time initial deposit. Batcher and master-administration
// circuits keep only their verifier keys, needed for the identity check.
export const PROVING_CIRCUITS = Object.freeze([
  ...USER_ACTION_CIRCUITS,
  'settleLiquidityOrder',
  'depositLiquidity',
]);

const RELEASE_KEY_FILES = [
  ...PROVING_CIRCUITS.map((circuit) => `${circuit}.prover`),
  ...REQUIRED_ARTIFACT_CIRCUITS.map((circuit) => `${circuit}.verifier`),
].sort();

const RELEASE_ZKIR_FILES = PROVING_CIRCUITS.flatMap((circuit) => [
  `${circuit}.bzkir`,
  `${circuit}.zkir`,
]).sort();

const RELEASE_WITNESSES = Object.freeze(['cancelSecret', 'wit_divU128ByU64', 'wit_sqrtU128', 'localSk']);

const moduleCache = new Map<string, { releaseId: string; module: Promise<unknown> }>();

const readFileNames = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort();

const assertExactFiles = (label: string, directory: string, expected: readonly string[]): void => {
  if (!existsSync(directory)) throw new Error(`compiled_artifact_${label}_dir_missing:${directory}`);

  const actual = readFileNames(directory);
  const missing = expected.filter((name) => !actual.includes(name));
  const extra = actual.filter((name) => !expected.includes(name));

  if (missing.length > 0) throw new Error(`compiled_artifact_${label}_files_missing:${missing.join(',')}`);
  if (extra.length > 0) throw new Error(`compiled_artifact_${label}_files_extra:${extra.join(',')}`);
};

const assertExactNames = (label: string, actual: readonly string[], expected: readonly string[]): void => {
  const missing = expected.filter((name) => !actual.includes(name));
  const extra = actual.filter((name) => !expected.includes(name));

  if (new Set(actual).size !== actual.length) throw new Error(`compiled_artifact_${label}_duplicates`);
  if (missing.length > 0) throw new Error(`compiled_artifact_${label}_missing:${missing.join(',')}`);
  if (extra.length > 0) throw new Error(`compiled_artifact_${label}_extra:${extra.join(',')}`);
};

export const assertAuditedArtifacts = (compiledDir = DEFAULT_COMPILED_DIR) => {
  const resolved = path.resolve(compiledDir);
  const manifestPath = path.join(resolved, 'release.json');
  if (!existsSync(manifestPath)) throw new Error('compiled_artifact_release_manifest_missing');
  const manifestSha256 = sha256File(manifestPath);
  const descriptor = APPROVED_AMM_RELEASES.find((entry) => entry.manifestSha256 === manifestSha256);
  if (!descriptor) throw new Error('compiled_artifact_release_manifest_mismatch');
  if (descriptor.manifestSha256 !== manifestSha256)
    throw new Error('compiled_artifact_release_manifest_mismatch');
  const release = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    sourceSha256: string;
    files: Record<string, string>;
  };
  if (release.sourceSha256 !== descriptor.sourceSha256)
    throw new Error('compiled_artifact_release_source_mismatch');
  for (const [relative, expected] of Object.entries(release.files)) {
    const filePath = path.join(resolved, relative);
    if (!existsSync(filePath)) throw new Error(`compiled_artifact_file_missing:${relative}`);
    if (sha256File(filePath) !== `sha256:${expected}`)
      throw new Error(`compiled_artifact_hash_mismatch:${relative}`);
  }
  const infoPath = path.join(resolved, 'compiler', 'contract-info.json');
  if (!existsSync(infoPath)) {
    throw new Error(`compiled_contract_info_missing:${infoPath}`);
  }
  const info = JSON.parse(readFileSync(infoPath, 'utf8')) as ContractInfo;
  if (info['compiler-version'] !== COMPACT_COMPILER_VERSION) {
    throw new Error(`compiled_artifact_compiler_mismatch:${info['compiler-version']}`);
  }
  if (info['language-version'] !== COMPACT_LANGUAGE_VERSION) {
    throw new Error(`compiled_artifact_language_mismatch:${info['language-version']}`);
  }
  if (info['runtime-version'] !== COMPACT_RUNTIME_VERSION) {
    throw new Error(`compiled_artifact_runtime_mismatch:${info['runtime-version']}`);
  }
  const circuits = ((info.circuits ?? []) as Array<{ name: string }>).map((entry) => entry.name);
  assertExactNames('circuits', circuits, REQUIRED_ARTIFACT_CIRCUITS);
  const witnesses = (info.witnesses ?? []).map((entry) => entry.name).sort();
  assertExactNames('witnesses', witnesses, RELEASE_WITNESSES);
  assertExactFiles('key', path.join(resolved, 'keys'), RELEASE_KEY_FILES);
  assertExactFiles('zkir', path.join(resolved, 'zkir'), RELEASE_ZKIR_FILES);
  return {
    compiledDir: resolved,
    releaseId: descriptor.releaseId,
    sourceSha256: release.sourceSha256,
    orderSchemaVersion: descriptor.orderSchemaVersion,
    publicLiquiditySettlement: descriptor.publicLiquiditySettlement,
    releaseCircuits: REQUIRED_ARTIFACT_CIRCUITS,
    compiler: info['compiler-version'],
    language: info['language-version'],
    runtime: info['runtime-version'],
    circuits: USER_ACTION_CIRCUITS,
    hashes: {
      contractIndex: sha256File(path.join(resolved, 'contract', 'index.js')),
      contractInfo: sha256File(infoPath),
    },
  };
};

export const loadCompiledModule = async (compiledDir = DEFAULT_COMPILED_DIR) => {
  const release = assertAuditedArtifacts(compiledDir);
  const modulePath = path.join(path.resolve(compiledDir), 'contract', 'index.js');
  const moduleUrl = pathToFileURL(modulePath).href;
  const cached = moduleCache.get(moduleUrl);
  if (cached != null) {
    if (cached.releaseId !== release.releaseId) throw new Error('amm_compiled_directory_release_changed');
    return cached.module;
  }
  const module = import(moduleUrl);
  moduleCache.set(moduleUrl, { releaseId: release.releaseId, module });
  return module;
};

/** Throws unless the contract state matches this release. */
export const assertCompatibleContractState = (state: unknown, compiledDir = DEFAULT_COMPILED_DIR): void => {
  const release = assertAuditedArtifacts(compiledDir);
  assertStateMatchesRelease(state, release);
};

const assertStateMatchesRelease = (
  state: unknown,
  release: ReturnType<typeof assertAuditedArtifacts>,
): void => {
  const candidate = state as {
    operations?: () => Array<string | Uint8Array>;
    operation?: (name: string) => { verifierKey: Uint8Array } | undefined;
  };
  if (typeof candidate?.operations !== 'function' || typeof candidate?.operation !== 'function') {
    throw new Error('amm_contract_operations_unavailable');
  }
  const names = candidate
    .operations()
    .map((name) => (typeof name === 'string' ? name : new TextDecoder().decode(name)));
  assertExactNames('deployed_circuits', names, release.releaseCircuits);
  for (const circuit of release.releaseCircuits) {
    const deployedKey = candidate.operation(circuit)?.verifierKey;
    const localKey = readFileSync(path.join(release.compiledDir, 'keys', `${circuit}.verifier`));
    if (deployedKey == null || !localKey.equals(Buffer.from(deployedKey))) {
      throw new Error(`amm_deployed_verifier_mismatch:${circuit}`);
    }
  }
};

/** Returns the bundled release whose verifier keys match the deployed contract. */
export const selectCompatibleRelease = (state: unknown, compiledDir?: string) => {
  if (compiledDir != null) {
    const release = assertAuditedArtifacts(compiledDir);
    assertStateMatchesRelease(state, release);
    return release;
  }
  const candidate = state as { operations?: () => Array<string | Uint8Array> };
  if (typeof candidate?.operations !== 'function') throw new Error('amm_contract_operations_unavailable');
  assertExactNames(
    'deployed_circuits',
    candidate.operations().map((name) => (typeof name === 'string' ? name : new TextDecoder().decode(name))),
    REQUIRED_ARTIFACT_CIRCUITS,
  );
  const releases =
    compiledDir == null
      ? APPROVED_AMM_RELEASES.map((entry) => assertAuditedArtifacts(entry.compiledDir))
      : [assertAuditedArtifacts(compiledDir)];
  const matches = releases.filter((release) => {
    try {
      assertStateMatchesRelease(state, release);
      return true;
    } catch {
      return false;
    }
  });
  if (matches.length !== 1) throw new Error('amm_deployed_release_unsupported');
  return matches[0];
};
