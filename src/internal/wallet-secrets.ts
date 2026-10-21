import { createHmac, hkdfSync } from 'node:crypto';

import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';

import { normalizeBytes32Hex } from './common.js';
import type { SeedInput, UnknownRecord } from './types.js';
import type { Witnesses } from '../../artifacts/NorthStarDEX/contract/index.js';

type HdWalletLike = {
  selectAccount: (account: number) => {
    selectRole: (role: unknown) => {
      deriveKeyAt: (keyIndex: number) => { type: string; key: Uint8Array };
    };
  };
  clear: () => void;
};

export type WalletSecrets = {
  shielded: Uint8Array;
  unshielded: Uint8Array;
  dust: Uint8Array;
};

export type DeriveWalletSecretsOptions = {
  seed: SeedInput;
  account?: number;
  keyIndex?: number;
};

export const normalizeSeedHex = (seed: SeedInput | null | undefined): string => {
  const normalized =
    seed instanceof Uint8Array
      ? Buffer.from(seed).toString('hex')
      : String(seed ?? '')
          .trim()
          .replace(/^0x/iu, '')
          .toLowerCase();
  if (normalized.length < 64 || normalized.length % 2 !== 0 || !/^[0-9a-f]+$/u.test(normalized)) {
    throw new Error('seed_must_be_hex_at_least_32_bytes');
  }
  return normalized;
};

const withHdWallet = <T>(seed: SeedInput, fn: (wallet: HdWalletLike) => T): T => {
  const result = HDWallet.fromSeed(Buffer.from(normalizeSeedHex(seed), 'hex'));
  if (result.type !== 'seedOk') {
    throw new Error('invalid_seed_for_hd_wallet');
  }
  try {
    return fn(result.hdWallet as HdWalletLike);
  } finally {
    result.hdWallet.clear();
  }
};

const deriveRoleSecret = ({
  hdWallet,
  account = 0,
  role,
  keyIndex = 0,
}: {
  hdWallet: HdWalletLike;
  account?: number;
  role: unknown;
  keyIndex?: number;
}): Uint8Array => {
  const result = hdWallet.selectAccount(Number(account)).selectRole(role).deriveKeyAt(Number(keyIndex));
  if (result.type !== 'keyDerived') {
    throw new Error(`key_derivation_out_of_bounds:${role}:${keyIndex}`);
  }
  try {
    return Uint8Array.from(result.key);
  } finally {
    result.key.fill(0);
  }
};

export const deriveWalletSecrets = ({
  seed,
  account = 0,
  keyIndex = 0,
}: DeriveWalletSecretsOptions): WalletSecrets =>
  withHdWallet(seed, (hdWallet) => ({
    shielded: deriveRoleSecret({ hdWallet, account, role: Roles.Zswap, keyIndex }),
    unshielded: deriveRoleSecret({ hdWallet, account, role: Roles.NightExternal, keyIndex }),
    dust: deriveRoleSecret({ hdWallet, account, role: Roles.Dust, keyIndex }),
  }));

/** The settings a pool is created with. They also select its creator secret. */
export type PoolSettings = {
  tokenA: string;
  tokenB: string;
  lpFeeBps: string | number | bigint;
  orderBondToken: string;
  orderBondAmount: string | number | bigint;
};

// Order and pool secrets come from the seed, so the seed alone can cancel the
// wallet's orders and fund its pools. One key per account and key index; each
// secret is an HMAC of that key over the order or pool it belongs to.
export const deriveOrderSecretsKey = ({ seed, account = 0, keyIndex = 0 }: DeriveWalletSecretsOptions) =>
  new Uint8Array(
    hkdfSync(
      'sha256',
      Buffer.from(normalizeSeedHex(seed), 'hex'),
      'northstar-sdk',
      `order-secrets/v1/${account}/${keyIndex}`,
      32,
    ),
  );

const bytes32 = (value: string, label: string) => Buffer.from(normalizeBytes32Hex(value, label), 'hex');

const uint128 = (value: string | number | bigint, label: string) => {
  const amount = BigInt(String(value));
  if (amount < 0n || amount >= 1n << 128n) throw new Error(`${label}_out_of_range`);
  return Buffer.from(amount.toString(16).padStart(32, '0'), 'hex');
};

const keyedSecret = (key: Uint8Array, purpose: string, parts: Buffer[]): string =>
  createHmac('sha256', key)
    .update(Buffer.concat([Buffer.from(purpose), ...parts]))
    .digest('hex');

export const deriveCancelSecret = (key: Uint8Array, pool: string, orderId: string): string =>
  keyedSecret(key, 'cancel', [bytes32(pool, 'contract_address'), bytes32(orderId, 'order_id')]);

export const deriveCreatorSecret = (key: Uint8Array, settings: PoolSettings): string =>
  keyedSecret(key, 'pool-creator', [
    bytes32(settings.tokenA, 'token_a'),
    bytes32(settings.tokenB, 'token_b'),
    uint128(settings.lpFeeBps, 'lp_fee_bps'),
    bytes32(settings.orderBondToken, 'order_bond_token'),
    uint128(settings.orderBondAmount, 'order_bond_amount'),
  ]);

const normalizeCancelSecretBytes = (value: Uint8Array | null): Uint8Array => {
  if (value == null) {
    throw new Error('cancel_secret_required');
  }
  if (!(value instanceof Uint8Array) || value.length !== 32) {
    throw new Error('cancel_secret_must_be_bytes32');
  }
  if (value.every((byte) => byte === 0)) {
    throw new Error('cancel_secret_must_not_be_zero');
  }
  return value;
};

export const makeWitnessBundle = ({
  cancelSecretBytes = null,
  creatorSecretBytes = null,
}: {
  cancelSecretBytes?: Uint8Array | null;
  /** Pool creator secret: supplied only to deploy a pool and make its initial deposit. */
  creatorSecretBytes?: Uint8Array | null;
} = {}): Witnesses<UnknownRecord> => ({
  wit_divU128ByU64: (context, dividend, divisor) => {
    if (divisor === 0n) throw new Error('division_by_zero');
    return [context.privateState ?? {}, { quotient: dividend / divisor, remainder: dividend % divisor }];
  },
  wit_sqrtU128: (context, value) => {
    if (value < 0n) throw new Error('sqrt_negative');
    let root = value;
    let next = (value + 1n) / 2n;
    while (next < root) {
      root = next;
      next = (root + value / root) / 2n;
    }
    return [context.privateState, root];
  },
  localSk: (context) => {
    if (creatorSecretBytes == null) throw new Error('administrative_witness_not_available_in_user_sdk');
    return [context.privateState ?? {}, creatorSecretBytes];
  },
  cancelSecret: (context) => [context.privateState ?? {}, normalizeCancelSecretBytes(cancelSecretBytes)],
});
