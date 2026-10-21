// Create a pool, then make its first deposit, which sets the opening price.
// The pool's creator secret is derived from your seed.
// node --env-file=.env examples/create-pool.mjs <tokenA> <tokenB> <amountA> <amountB>
import { readFile, writeFile } from 'node:fs/promises';
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const [tokenA, tokenB, amountA, amountB] = process.argv.slice(2);
if (!tokenA || !tokenB || !amountA || !amountB)
  throw new Error('usage: create-pool.mjs <tokenA> <tokenB> <amountA> <amountB>');
const file = process.env.WALLET_CHECKPOINT ?? 'wallet.checkpoint.json';

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
try {
  const sdk = northstarsdk({
    providers: relay.providers,
    seed: process.env.WALLET_SEED,
    checkpoint: JSON.parse(await readFile(file, 'utf8')),
  });
  const created = await sdk.createPool({
    tokenA,
    tokenB,
    lpFeeBps: 30,
    orderBondToken: tokenA,
    orderBondAmount: 1_000n,
  });
  await created.submit();
  console.log({ pool: created.pool });

  const funding = await sdk.fundPool({
    pool: created.pool,
    amountA: BigInt(amountA),
    amountB: BigInt(amountB),
  });
  const submitted = await funding.submit();
  await writeFile(file, JSON.stringify(submitted.checkpoint), { mode: 0o600 });
  console.log({ txId: submitted.txId });
} finally {
  await relay.close();
}
