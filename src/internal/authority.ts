import { CompactTypeBytes, CompactTypeVector, persistentHash } from '@midnight-ntwrk/compact-runtime';

import { bytes32FromHex, hexFromBytes, normalizeBytes32Hex } from './common.js';

/**
 * Identities the NorthStar Settlement Engine requires before it settles a pool.
 * A pool deployed with other values is valid on chain but is never settled by it.
 */
export const NORTHSTAR_POOL_AUTHORITY = Object.freeze({
  masterAuthId: '17674f45dd2c960bcd352382965a6f59e727698700eb18f33f9363833ffbcce0',
  batcherAuthId: 'ca2d60d933608eb993d169b7abd6b85dafd71db6ace91c9a73e09dd1ccde3878',
  /** Unshielded address bytes of mn_addr1u36ey7qpmnanx5v660tfajx3p7m63avet4uzdp5mz93gl7548ywqp2rk2y. */
  protocolFeeRecipient: 'e475927801dcfb33519ad3d69ec8d10fb7a8f5995d7826869b11628ffa95391c',
});

export type PoolAuthority = {
  /** From `poolAuthorityId('master', secret)`. */
  masterAuthId: string;
  /** From `poolAuthorityId('batcher', secret)`. */
  batcherAuthId: string;
  /** Receives the protocol fees: an mn_addr1… address or its 32-byte hex. */
  protocolFeeRecipient: string;
};

// The contract's domains: an ID is persistentHash([pad(32, domain), secret]).
const DOMAINS = {
  master: 'BSV33_MASTER_AUTH',
  batcher: 'BSV33_BATCHER_AUTH',
  creator: 'BSV33_DEPLOYER_AUTH',
};

const authId = (role: keyof typeof DOMAINS, secret: string): string => {
  const normalized = normalizeBytes32Hex(secret, `${role}_secret`);
  if (/^0+$/u.test(normalized)) throw new Error(`${role}_secret_must_not_be_zero`);
  const domain = new Uint8Array(32);
  domain.set(new TextEncoder().encode(DOMAINS[role]));
  const bytes = bytes32FromHex(normalized, `${role}_secret`);
  try {
    return hexFromBytes(persistentHash(new CompactTypeVector(2, new CompactTypeBytes(32)), [domain, bytes]));
  } finally {
    bytes.fill(0);
  }
};

/** The contract's creator identity for a creator secret. */
export const poolCreatorId = (creatorSecret: string): string => authId('creator', creatorSecret);

/** The pool's master or batcher ID for a 32-byte hex secret, for `createPool`'s `authority`. */
export const poolAuthorityId = (role: 'master' | 'batcher', secret: string): string => {
  if (role !== 'master' && role !== 'batcher') throw new Error('authority_role_must_be_master_or_batcher');
  return authId(role, secret);
};
