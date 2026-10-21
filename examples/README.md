# Examples

Each script imports only `@northstardex/sdk`. Copy one into your project, fill in `.env` from [`mainnet.env.example`](../mainnet.env.example) and run it:

```bash
node --env-file=.env sync-wallet.mjs
```

In this repository they also run as they are, after `npm run build`.

| Script | Does |
| --- | --- |
| `read-price.mjs` | Pool price and a swap quote (no seed) |
| `sync-wallet.mjs` | Wallet addresses; sync and save a checkpoint |
| `swap.mjs` | Place a swap order |
| `order-status.mjs` | Check whether an order is still open (no seed) |
| `cancel-order.mjs` | Cancel a swap order |
| `add-liquidity.mjs` | Add liquidity |
| `create-pool.mjs` | Create a pool and make its first deposit |

The seed and the checkpoint file are private: the seed controls the wallet, and the checkpoint shows its balances and history.
