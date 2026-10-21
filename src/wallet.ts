import {
  addressFromKey,
  DustSecretKey,
  signatureVerifyingKey,
  ZswapSecretKeys,
} from '@midnight-ntwrk/ledger-v8';
import { DustAddress, MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';

import { normalizeBytes32Hex } from './internal/common.js';
import type { SeedInput } from './internal/types.js';
import {
  deriveCancelSecret,
  deriveCreatorSecret,
  deriveOrderSecretsKey,
  deriveWalletSecrets,
  normalizeSeedHex,
  type PoolSettings,
} from './internal/wallet-secrets.js';
import type { NorthStarWallet } from './transaction-builder.js';

/** Keys and addresses derived from a seed. `close()` wipes the order secrets key. */
export type NorthStarSeedWallet = NorthStarWallet & {
  unshieldedAddress: string;
  dustAddress: string;
  cancelSecret: (pool: string, orderId: string) => string;
  creatorSecret: (settings: PoolSettings) => string;
  close: () => void;
};

export const walletFromSeed = ({
  seed,
  account = 0,
  keyIndex = 0,
}: {
  seed: SeedInput;
  account?: number;
  keyIndex?: number;
}): NorthStarSeedWallet => {
  const seedHex = normalizeSeedHex(seed);
  const secrets = deriveWalletSecrets({ seed: seedHex, account, keyIndex });
  const orderSecretsKey = deriveOrderSecretsKey({ seed: seedHex, account, keyIndex });
  let closed = false;
  const openKey = () => {
    if (closed) throw new Error('wallet_closed');
    return orderSecretsKey;
  };
  let zswapSecretKeys: ZswapSecretKeys | null = null;
  let dustSecretKey: DustSecretKey | null = null;
  try {
    zswapSecretKeys = ZswapSecretKeys.fromSeed(secrets.shielded);
    dustSecretKey = DustSecretKey.fromSeed(secrets.dust);
    const unshieldedAddressHex = normalizeBytes32Hex(
      addressFromKey(signatureVerifyingKey(Buffer.from(secrets.unshielded).toString('hex'))),
      'unshielded_address',
    );
    return {
      unshieldedAddressHex,
      unshieldedAddress: MidnightBech32m.encode(
        'mainnet',
        new UnshieldedAddress(Buffer.from(unshieldedAddressHex, 'hex')),
      ).asString(),
      dustAddress: DustAddress.encodePublicKey('mainnet', dustSecretKey.publicKey),
      coinPublicKey: zswapSecretKeys.coinPublicKey,
      encryptionPublicKey: zswapSecretKeys.encryptionPublicKey,
      cancelSecret: (pool, orderId) => deriveCancelSecret(openKey(), pool, orderId),
      creatorSecret: (settings) => deriveCreatorSecret(openKey(), settings),
      close: () => {
        closed = true;
        orderSecretsKey.fill(0);
      },
    };
  } catch (error) {
    orderSecretsKey.fill(0);
    throw error;
  } finally {
    zswapSecretKeys?.clear();
    dustSecretKey?.clear();
    for (const value of Object.values(secrets)) value.fill(0);
  }
};
