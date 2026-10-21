// Print the wallet's addresses, sync it and save a checkpoint. Run it once
// before placing orders; later runs start from the saved checkpoint.
// node --env-file=.env examples/sync-wallet.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { northstarsdk, startProviderRelay } from '@northstardex/sdk';

const file = process.env.WALLET_CHECKPOINT ?? 'wallet.checkpoint.json';
const checkpoint = await readFile(file, 'utf8').then(JSON.parse, () => null);

const relay = await startProviderRelay({ projectId: process.env.BLOCKFROST_PROJECT_ID });
try {
  const sdk = northstarsdk({ providers: relay.providers, seed: process.env.WALLET_SEED, checkpoint });
  console.log(sdk.addresses());
  const synced = await sdk.sync({ onProgress: (progress) => console.log(progress) });
  await writeFile(file, JSON.stringify(synced), { mode: 0o600 });
  console.log(`Saved ${file}`);
} finally {
  await relay.close();
}
