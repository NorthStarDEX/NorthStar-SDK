// Pool price and a swap quote. Needs no seed.
// node --env-file=.env examples/read-price.mjs <pool> [AtoB|BtoA] [amountIn]
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const [pool, direction = 'AtoB', amountIn = '1000'] = process.argv.slice(2);
if (!pool) throw new Error('usage: read-price.mjs <pool> [AtoB|BtoA] [amountIn]');

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
try {
  const sdk = northstarsdk({ providers: relay.providers });
  console.log(await sdk.getPrice(pool));
  const quote = await sdk.quoteSwapOrder({
    pool,
    direction,
    amountIn: BigInt(amountIn),
    slippageBps: 100,
  });
  console.log({ expectedOut: quote.expectedOut, minAmountOut: quote.minAmountOut });
} finally {
  await relay.close();
}
