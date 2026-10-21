import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const guard = fileURLToPath(new URL('../scripts/check-published-files.mjs', import.meta.url));

const checkFixture = (files) => {
  const directory = mkdtempSync(join(tmpdir(), 'sdk-publication-'));
  try {
    execFileSync('git', ['init', '--quiet', directory]);
    for (const [name, content] of Object.entries(files)) {
      const path = join(directory, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
    execFileSync('git', ['add', '--force', '--', ...Object.keys(files)], { cwd: directory });
    return spawnSync(process.execPath, [guard], { cwd: directory, encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
};

test('publication rejects Compact source even inside the artifact directory', () => {
  const result = checkFixture({ 'artifacts/NorthStarDEX/contract.compact': '// synthetic source fixture' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Compact source/u);
});

test('publication rejects embedded source including renamed and nested map sources', () => {
  const embedded = { version: 3, sourcesContent: ['// synthetic source fixture'] };
  for (const map of [
    { ...embedded, sources: ['contract.compact'] },
    { ...embedded, sources: ['renamed-source.txt'] },
    embedded,
    { version: 3, sections: [{ offset: { line: 0, column: 0 }, map: embedded }] },
  ]) {
    const result = checkFixture({
      'artifacts/NorthStarDEX/contract/index.js.map': JSON.stringify(map),
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /embedded source/u);
  }
});

test('publication allows source-map filenames without embedded source text', () => {
  const result = checkFixture({
    'artifacts/NorthStarDEX/contract/index.js.map': JSON.stringify({
      version: 3,
      sources: ['contract.compact'],
    }),
  });
  assert.equal(result.status, 0, result.stderr);
});

const USER_CIRCUITS = [
  'depositOrder',
  'cancelOrder',
  'liquidityOrder',
  'cancelLiquidityOrder',
  'settleLiquidityOrder',
  'depositLiquidity',
];

test('publication ships proving material only for the user circuits', () => {
  for (const file of [
    'artifacts/NorthStarDEX/keys/settleOne.prover',
    'artifacts/NorthStarDEX/zkir/settleBatchUpTo5.bzkir',
    'artifacts/NorthStarDEX/zkir/claimProtocolFees.zkir',
    'artifacts/NorthStarDEX/keys/setBatcherAuthorization.prover',
    // A circuit nobody has listed yet is refused too, wherever the file is.
    'artifacts/NorthStarDEX/keys/futureCircuit.prover',
    'keys/settleOne.prover',
  ]) {
    const result = checkFixture({ [file]: 'synthetic' });
    assert.equal(result.status, 1, file);
    assert.match(result.stderr, /not a user circuit/u);
  }
  const allowed = checkFixture({
    'artifacts/NorthStarDEX/keys/settleOne.verifier': 'synthetic',
    ...Object.fromEntries(
      USER_CIRCUITS.flatMap((circuit) => [
        [`artifacts/NorthStarDEX/keys/${circuit}.prover`, 'synthetic'],
        [`artifacts/NorthStarDEX/zkir/${circuit}.zkir`, 'synthetic'],
        [`artifacts/NorthStarDEX/zkir/${circuit}.bzkir`, 'synthetic'],
      ]),
    ),
  });
  assert.equal(allowed.status, 0, allowed.stderr);
});

test('publication rejects local home-directory paths outside the artifacts', () => {
  for (const path of [
    ['', 'Users', 'someone', 'project'].join('/'),
    ['', 'home', 'someone', 'project'].join('/'),
  ]) {
    const result = checkFixture({ 'src/example.ts': `const file = '${path}/x';` });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /local home path/u);
  }
});
