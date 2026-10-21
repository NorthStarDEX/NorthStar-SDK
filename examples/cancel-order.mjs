// Cancel one of your swap orders. Its cancel secret is derived from your seed.
// node --env-file=.env examples/cancel-order.mjs <pool> <orderId>
import { readFile, writeFile } from 'node:fs/promises';
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const [pool, orderId] = process.argv.slice(2);
if (!pool || !orderId) throw new Error('usage: cancel-order.mjs <pool> <orderId>');
const file = process.env.WALLET_CHECKPOINT ?? 'wallet.checkpoint.json';

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
try {
  const sdk = northstarsdk({
    providers: relay.providers,
    seed: process.env.WALLET_SEED,
    checkpoint: JSON.parse(await readFile(file, 'utf8')),
  });
  const cancel = await sdk.buildCancelOrder({ pool, orderId });
  const submitted = await cancel.submit();
  await writeFile(file, JSON.stringify(submitted.checkpoint), { mode: 0o600 });
  console.log({ txId: submitted.txId });
} finally {
  await relay.close();
}
