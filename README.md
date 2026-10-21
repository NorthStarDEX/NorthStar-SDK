# NorthStar SDK

TypeScript SDK for NorthStar DEX on Midnight Mainnet: read pools, place and cancel swap and liquidity orders, and create pools.

## How orders work

- A swap or liquidity order locks your tokens in the pool. NorthStar's batcher settles open orders, usually in the next block, and sends the output to your wallet.
- Until it settles you can cancel an order and get everything back. Cancelling needs the order's cancel secret, which the SDK derives from your seed.
- Every order also locks the pool's order bond (`orderBond` from `sdk.getPool`). It goes back to the order's owner when the order settles or is cancelled.
- A swap's `amountIn` must be at least 1,000 base units (`MIN_SWAP_AMOUNT`), and every swap sets `minAmountOut` or `slippageBps`. The batcher fills it only if you get at least that much.
- A swap order lives 21 days by default, 30 at most. After its deadline it cannot fill, and anyone can cancel it; the refund still goes to the owner.
- Transactions pay fees in DUST. DUST comes from NIGHT: register NIGHT to generate DUST for the wallet's DUST address (`sdk.addresses().dust`) with a Midnight wallet before you place orders.

## What you need

- **Node.js 24.**
- **Seed**: the wallet's master secret, as hex. The SDK derives the wallet's keys and each order's cancel secret from it. Keep it private. Prices and quotes work without it.
- **Proof server**: Midnight transactions carry zero-knowledge proofs, made on your machine by the proof server. The SDK uses `http://127.0.0.1:6300`; set `provingServerUrl` to change it.

  ```bash
  docker run --rm -p 127.0.0.1:6300:6300 midnightntwrk/proof-server:8.1.0
  ```

- **Providers**: a Midnight Mainnet node and indexer. `startProviderRelay` connects to Blockfrost through a relay on `127.0.0.1:44201` that keeps your project ID out of URLs and logs. To use your own endpoints, pass `{ node, nodeWs, indexer, indexerWs }` as `providers` (https/wss, no credentials in the URL).
- **Checkpoint**: the wallet's synced state, as JSON. Without it every new process syncs the wallet from the start, which can take a long time. It holds no keys but shows the wallet's balances and history, so keep it private. It works only with the providers it was synced with, so keep the relay port fixed.

## Install

```bash
npm install github:NorthStarDEX/NorthStar-SDK
```

npm ignores a dependency's `overrides`, so add this one to your own `package.json`. It keeps a single copy of the Midnight runtime the SDK was tested with; without it the SDK refuses to build transactions:

```json
"overrides": {
  "@midnight-ntwrk/compact-runtime": "0.16.0"
}
```

## Setup

```js
import { readFile, writeFile } from 'node:fs/promises';
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
const sdk = northstarsdk({
  providers: relay.providers,
  seed: process.env.WALLET_SEED,
  checkpoint: await readFile('wallet.checkpoint.json', 'utf8').then(JSON.parse, () => null),
});

// ...

await relay.close();
```

For prices and quotes only: `northstarsdk({ providers: relay.providers })`.

## Sync the wallet

```js
console.log(sdk.addresses()); // { unshielded, dust }: send tokens to unshielded

const checkpoint = await sdk.sync();
await writeFile('wallet.checkpoint.json', JSON.stringify(checkpoint), { mode: 0o600 });
```

Every submit returns the wallet's new state as `submitted.checkpoint`. Save it the same way.

`sdk.balances()` syncs the same way and returns `{ unshielded, dust }`: unshielded token amounts by token type, and DUST in SPECK.

The wallet reconnects to the indexer by itself when a connection drops; the SDK keeps those reconnects out of the console. If the wallet cannot catch up within an hour, `sync()`, `balances()` and `prove()` fail with `wallet_sync_timeout` and the last reconnect reason.

## Read a pool

```js
const price = await sdk.getPrice(pool); // reserves, fee, priceBPerA, priceAPerB
const info = await sdk.getPool(pool); // also LP token, order bond, open orders, authority, servedByNorthStar
const quote = await sdk.quoteSwapOrder({ pool, direction: 'AtoB', amountIn: 20_000n, slippageBps: 100 });
```

Amounts are base units. Results return them as decimal strings.

## Swap

```js
const order = await sdk.buildSwapOrder({
  pool,
  direction: 'AtoB', // pay token A, receive token B
  amountIn: 20_000n,
  slippageBps: 100, // or minAmountOut
});
const submitted = await order.submit(); // { txId, blockHash, blockHeight, checkpoint }

await sdk.getOrder(pool, order.orderId); // null once settled or cancelled
```

`submit()` proves, balances, signs and sends the order, then waits until it is final and the indexer shows it, so the next `getOrder` or `getPool` already sees it. To see the fee before sending, run the steps yourself:

```js
const proven = await order.prove();
const balanced = await proven.balance();
console.log(balanced.fee); // in SPECK, 10^15 SPECK = 1 DUST
await balanced.submit(); // or balanced.close() to drop it
```

An SDK instance opens one wallet at a time: submit or close an order before proving the next one.

`recipient` gets the output and `owner` gets the bond and any refund; both default to your wallet.

## Cancel

```js
const cancel = await sdk.buildCancelOrder({ pool, orderId });
await cancel.submit();
```

Use `buildCancelLiquidityOrder` for liquidity orders.

## Liquidity

```js
const order = await sdk.buildLiquidityOrder({
  pool,
  kind: 'add',
  amountA: 10_000n,
  amountB: 20_000n,
  slippageBps: 100, // or minLp
});
await order.submit();
```

To withdraw, use `{ kind: 'remove', lp, slippageBps }`, or `minA` and `minB` instead of `slippageBps`. `sdk.quoteLiquidityOrder` takes the same options and shows the minimums the order will carry. Liquidity orders live 40 days by default. If NorthStar has not settled one after 30 days, anyone can settle it with `sdk.buildPublicLiquiditySettlement({ pool, orderId })`.

With `journalDir` set in the config, the SDK saves each liquidity order there before sending it. If a submit ends without a clear result, keep the file and pass its path to `sdk.reconcileSubmission`: it checks the chain and never sends the order again.

## Create a pool

```js
const created = await sdk.createPool({
  tokenA,
  tokenB,
  lpFeeBps: 30,
  orderBondToken: tokenA,
  orderBondAmount: 1_000n,
});
await created.submit();

const funding = await sdk.fundPool({ pool: created.pool, amountA: 1_000_000n, amountB: 2_000_000n });
await funding.submit();
```

Only the pool's creator can make the first deposit, which sets the opening price.

The NorthStar batcher only settles pools deployed with these values, which `createPool` uses:

| | |
| --- | --- |
| Master | `17674f45dd2c960bcd352382965a6f59e727698700eb18f33f9363833ffbcce0` |
| Batcher | `ca2d60d933608eb993d169b7abd6b85dafd71db6ace91c9a73e09dd1ccde3878` |
| Protocol fee recipient | `mn_addr1u36ey7qpmnanx5v660tfajx3p7m63avet4uzdp5mz93gl7548ywqp2rk2y` |
| Maintenance committee | empty, threshold 1 |

For a test pool that NorthStar's batcher never settles, pass your own `authority`. Keep the two 32-byte hex secrets:

```js
import { poolAuthorityId } from '@northstardex/sdk';

await sdk.createPool({
  tokenA,
  tokenB,
  orderBondToken: tokenA,
  orderBondAmount: 1_000n,
  authority: {
    masterAuthId: poolAuthorityId('master', masterSecret),
    batcherAuthId: poolAuthorityId('batcher', batcherSecret),
    protocolFeeRecipient: 'mn_addr1…',
  },
});
```

`(await sdk.getPool(pool)).servedByNorthStar` tells whether NorthStar settles a pool.

## Secrets

The SDK derives each order's cancel secret and each pool's creator secret from your seed, so the seed alone can cancel your orders and fund your pools. It never writes secrets to disk, and leaves them out of `toJSON()`, logs and submit results.

If you pass your own `cancelSecret` or `creatorSecret`, save it before you submit: without it you cannot cancel that order or fund that pool. `order.cancelSecret` and `created.creatorSecret` return the secret in use.

## Examples

Runnable scripts are in [`examples/`](examples/README.md).

## License

Licensed under the Apache License 2.0.
