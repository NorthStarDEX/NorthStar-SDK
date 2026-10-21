import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import * as publicApi from '../dist/index.js';
import { assertSingleCompactRuntime, compactRuntimeCopies } from '../dist/internal/artifacts.js';

const packedFiles = () => {
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' }),
  );
  return pack.files.map((file) => file.path);
};

// Every module dist/index.js loads, following static and dynamic relative imports.
const loadedModules = () => {
  const seen = new Set();
  const visit = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    const source = readFileSync(file, 'utf8');
    for (const [, specifier] of source.matchAll(/(?:from|import\()\s*'(\.{1,2}\/[^']+)'/gu))
      visit(path.join(path.dirname(file), specifier));
  };
  visit('dist/index.js');
  return [...seen];
};

test('the package ships every module the SDK loads, every artifact, and nothing from the repo', () => {
  const files = packedFiles();
  const modules = loadedModules();
  assert.ok(modules.length > 10);
  for (const module of modules) {
    assert.ok(files.includes(module), module);
    assert.ok(files.includes(module.replace(/\.js$/u, '.d.ts')), `${module} types`);
  }
  const artifacts = execFileSync('git', ['ls-files', 'artifacts'], { encoding: 'utf8' }).trim().split('\n');
  assert.deepEqual(files.filter((file) => file.startsWith('artifacts/')).sort(), artifacts.sort());
  for (const file of ['LICENSE', 'NOTICE']) assert.ok(files.includes(file), file);
  for (const file of files)
    assert.match(
      file,
      /^(?:dist\/.+\.(?:js|d\.ts)|artifacts\/.+|README\.md|LICENSE|NOTICE|package\.json)$/u,
      file,
    );
});

test('no shipped module reads environment variables', () => {
  for (const module of loadedModules())
    assert.equal(readFileSync(module, 'utf8').includes('process.env'), false, module);
});

test('examples use only the published package and Node built-ins', () => {
  const examples = readdirSync('examples').filter((name) => name.endsWith('.mjs'));
  assert.ok(examples.length >= 5);
  for (const name of examples) {
    const file = path.join('examples', name);
    execFileSync(process.execPath, ['--check', file]);
    const imports = [...readFileSync(file, 'utf8').matchAll(/^import\s+([^;]+?)\s+from\s+'([^']+)'/gmu)];
    assert.ok(imports.length > 0, name);
    for (const [, clause, specifier] of imports) {
      if (specifier.startsWith('node:')) continue;
      assert.equal(specifier, '@northstardex/sdk', `${name}: ${specifier}`);
      for (const imported of clause.replace(/[{}]/gu, '').split(',')) {
        const exported = imported.trim().split(/\s+as\s+/u)[0];
        assert.ok(exported in publicApi, `${name}: ${exported}`);
      }
    }
  }
});

test('one compact-runtime copy is required, and the README gives the override that ensures it', () => {
  const copies = compactRuntimeCopies();
  assert.equal(new Set(copies).size, 1);
  assertSingleCompactRuntime();
  assert.throws(
    () => assertSingleCompactRuntime([copies[0], '/app/node_modules/other/compact-runtime/index.js']),
    /midnight_runtime_duplicated/,
  );
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8')).packages;
  const runtime = '@midnight-ntwrk/compact-runtime';
  assert.ok(
    readFileSync('README.md', 'utf8').includes(`"${runtime}": "${lock[`node_modules/${runtime}`].version}"`),
  );
  // midnight-js-contracts imports the native runtime without declaring it, so
  // the SDK depends on the tested version directly and npm hoists it.
  const native = '@midnight-ntwrk/onchain-runtime-v3';
  const { dependencies } = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(dependencies[native], lock[`node_modules/${native}`].version);
});
