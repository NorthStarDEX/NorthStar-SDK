// Fails if a tracked file would publish contract source, proving material for
// a circuit outside the user circuits below, or a local home-directory path.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// The only circuits that ship a proving key and circuit files. Every other
// circuit, including the batcher and admin ones, ships only its verifier key,
// which the SDK uses to check that a pool runs this contract.
const userCircuits = new Set([
  'depositOrder',
  'cancelOrder',
  'liquidityOrder',
  'cancelLiquidityOrder',
  'settleLiquidityOrder',
  'depositLiquidity',
]);
const provingFile = /(?:^|\/)([^/]+)\.(?:prover|zkir|bzkir)$/u;
const homePath = /(?:\/Users\/|\/home\/)[A-Za-z0-9._-]+\//u;

const hasEmbeddedSource = (map) =>
  (Array.isArray(map?.sourcesContent) &&
    map.sourcesContent.some((content) => typeof content === 'string' && content.length > 0)) ||
  (Array.isArray(map?.sections) && map.sections.some((section) => hasEmbeddedSource(section.map)));

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const failures = [];

for (const file of files) {
  const proving = provingFile.exec(file);
  if (proving && !userCircuits.has(proving[1]))
    failures.push(`${file}: proving material for a circuit that is not a user circuit`);
  else if (/\.compact$/iu.test(file)) failures.push(`${file}: Compact source`);
  else if (file.endsWith('.map') && hasEmbeddedSource(JSON.parse(readFileSync(file, 'utf8'))))
    failures.push(`${file}: embedded source`);
  else if (!file.startsWith('artifacts/')) {
    const content = readFileSync(file);
    if (!content.includes(0) && homePath.test(content.toString('utf8')))
      failures.push(`${file}: local home path`);
  }
}

if (failures.length > 0) {
  console.error('Files that must not be published:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Published files OK');
