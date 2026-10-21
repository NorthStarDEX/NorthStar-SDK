// Add liquidity, accepting at most 1% fewer LP tokens than the current quote.
// node --env-file=.env examples/add-liquidity.mjs <pool> <amountA> <amountB>
import { readFile, writeFile } from 'node:fs/promises';
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const [pool, amountA, amountB] = process.argv.slice(2);
if (!pool || !amountA || !amountB) throw new Error('usage: add-liquidity.mjs <pool> <amountA> <amountB>');
const file = process.env.WALLET_CHECKPOINT ?? 'wallet.checkpoint.json';

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
try {
  const sdk = northstarsdk({
    providers: relay.providers,
    seed: process.env.WALLET_SEED,
    checkpoint: JSON.parse(await readFile(file, 'utf8')),
  });
  const order = await sdk.buildLiquidityOrder({
    pool,
    kind: 'add',
    amountA: BigInt(amountA),
    amountB: BigInt(amountB),
    slippageBps: 100,
  });
  const submitted = await order.submit();
  await writeFile(file, JSON.stringify(submitted.checkpoint), { mode: 0o600 });
  console.log({ orderId: order.orderId, txId: submitted.txId });
} finally {
  await relay.close();
}
