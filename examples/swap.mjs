// Place a swap order that accepts at most 1% less than the current quote.
// NorthStar's batcher settles it; cancel it with cancel-order.mjs.
// node --env-file=.env examples/swap.mjs <pool> <AtoB|BtoA> <amountIn>
import { readFile, writeFile } from 'node:fs/promises';
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const [pool, direction, amountIn] = process.argv.slice(2);
if (!pool || !direction || !amountIn) throw new Error('usage: swap.mjs <pool> <AtoB|BtoA> <amountIn>');
const file = process.env.WALLET_CHECKPOINT ?? 'wallet.checkpoint.json';

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
try {
  const sdk = northstarsdk({
    providers: relay.providers,
    seed: process.env.WALLET_SEED,
    checkpoint: JSON.parse(await readFile(file, 'utf8')),
  });
  const order = await sdk.buildSwapOrder({
    pool,
    direction,
    amountIn: BigInt(amountIn),
    slippageBps: 100,
  });
  const submitted = await order.submit();
  await writeFile(file, JSON.stringify(submitted.checkpoint), { mode: 0o600 });
  console.log({ orderId: order.orderId, txId: submitted.txId });
} finally {
  await relay.close();
}
