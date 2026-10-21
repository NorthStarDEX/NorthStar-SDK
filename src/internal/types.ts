export type UnknownRecord = Record<string, unknown>;

export type HexInput =
  | string
  | Uint8Array
  | ArrayLike<number>
  | {
      bytes?: Uint8Array;
      raw?: Uint8Array;
    }
  | null
  | undefined;

/** Saved wallet state. It holds no keys, but shows the wallet's balances and history. */
export type WalletCheckpoint = UnknownRecord & {
  network?: string;
  account?: number;
  keyIndex?: number;
  unshieldedAddress?: string;
  unshieldedAddressHex?: string;
  shieldedState?: unknown;
  unshieldedState?: unknown;
  dustState?: unknown;
  txHistory?: unknown;
};

export type SeedInput = string | Uint8Array;
