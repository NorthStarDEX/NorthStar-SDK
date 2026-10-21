import assert from 'node:assert/strict';
import test from 'node:test';
import { cpSync, mkdtempSync, mkdirSync, realpathSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('packaged artifact paths work inside spaces, percent signs and unicode', async () => {
  const root = realpathSync(mkdtempSync(path.join(tmpdir(), 'northstar package % ü-')));
  try {
    mkdirSync(path.join(root, 'dist', 'internal'), { recursive: true });
    cpSync('dist/internal/common.js', path.join(root, 'dist', 'internal', 'common.js'));
    writeFileSync(path.join(root, 'package.json'), '{"type":"module"}');
    mkdirSync(path.join(root, 'artifacts'));
    writeFileSync(path.join(root, 'artifacts', 'fixture.json'), '{"marker":true}');
    const { projectPath } = await import(
      pathToFileURL(path.join(root, 'dist', 'internal', 'common.js')).href
    );
    assert.equal(projectPath('artifacts', 'fixture.json'), path.join(root, 'artifacts', 'fixture.json'));
    assert.deepEqual(JSON.parse(readFileSync(projectPath('artifacts', 'fixture.json'), 'utf8')), {
      marker: true,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
