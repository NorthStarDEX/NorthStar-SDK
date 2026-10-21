// Check whether an order is still open. NorthStar's batcher settles orders,
// usually in the next block; a settled or cancelled order is gone.
// node --env-file=.env examples/order-status.mjs <pool> <orderId>
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const [pool, orderId] = process.argv.slice(2);
if (!pool || !orderId) throw new Error('usage: order-status.mjs <pool> <orderId>');

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
try {
  const sdk = northstarsdk({ providers: relay.providers });
  const order = await sdk.getOrder(pool, orderId);
  console.log(order ?? 'not open: settled, cancelled or never placed');
} finally {
  await relay.close();
}
