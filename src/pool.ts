import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  ContractMaintenanceAuthority,
  createConstructorContext,
  decodeZswapLocalState,
} from '@midnight-ntwrk/compact-runtime';
import {
  ContractDeploy,
  ContractState as LedgerContractState,
  Intent,
  Transaction,
} from '@midnight-ntwrk/ledger-v8';

import {
  assertAuditedArtifacts,
  assertCompatibleContractState,
  DEFAULT_COMPILED_DIR,
  loadCompiledModule,
} from './internal/artifacts.js';
import { NORTHSTAR_POOL_AUTHORITY, poolCreatorId, type PoolAuthority } from './internal/authority.js';
import { bytes32FromHex, hexFromBytes } from './internal/common.js';
import { assertCustomToken, type Environment } from './internal/environment.js';
import { makeWitnessBundle, type PoolSettings } from './internal/wallet-secrets.js';
import {
  buildUserActionTx,
  nonzeroBytes32Hex,
  readPool,
  unshieldedAddressHex,
  type Amount,
  type BuiltOrderTx,
  type CompiledModule,
  type NorthStarWallet,
} from './transaction-builder.js';

export { NORTHSTAR_POOL_AUTHORITY, poolAuthorityId, poolCreatorId } from './internal/authority.js';
export type { PoolAuthority } from './internal/authority.js';

export type CreatePoolOptions = {
  tokenA: string;
  tokenB: string;
  /** Swap fee in basis points, 5 to 2,000. Default 30. */
  lpFeeBps?: number | bigint;
  /** Token of the bond every order locks until it settles or is cancelled. */
  orderBondToken: string;
  orderBondAmount: Amount;
  /** Defaults to a secret derived from your seed and these settings. If you pass your own, store it. */
  creatorSecret?: string;
  /** Who may settle the pool and receives protocol fees. Defaults to NorthStar. */
  authority?: PoolAuthority;
};

export type FundPoolOptions = {
  pool: string;
  amountA: Amount;
  amountB: Amount;
  /** Needed only for a pool created with your own secret. */
  creatorSecret?: string;
  /** LP tokens to accept at least. Defaults to the exact first-deposit amount. */
  minLp?: Amount;
};

const positive = (value: unknown, label: string): bigint => {
  let amount: bigint;
  try {
    amount = BigInt(String(value));
  } catch {
    throw new Error(`${label}_invalid`);
  }
  if (amount <= 0n || amount >= 1n << 64n) throw new Error(`${label}_invalid`);
  return amount;
};

const integerSqrt = (value: bigint): bigint => {
  if (value < 2n) return value;
  let root = value;
  let next = (root + 1n) >> 1n;
  while (next < root) {
    root = next;
    next = (root + value / root) >> 1n;
  }
  return root;
};

/** LP minted to the creator by the first deposit: sqrt(A * B) minus one permanently locked unit. */
export const initialLpOut = (amountA: bigint, amountB: bigint): bigint => {
  const lp = integerSqrt(amountA * amountB) - 1n;
  if (lp <= 0n) throw new Error('initial_liquidity_too_small');
  return lp;
};

// An explicit secret wins; otherwise the wallet derives it from its seed and the
// pool's settings, so fundPool can find it again from the pool alone.
const resolveCreatorSecret = (
  wallet: NorthStarWallet,
  creatorSecret: string | undefined,
  settings: () => PoolSettings,
): string => {
  if (creatorSecret != null) return nonzeroBytes32Hex(creatorSecret, 'creator_secret');
  if (wallet.creatorSecret == null) throw new Error('creator_secret_required');
  return nonzeroBytes32Hex(wallet.creatorSecret(settings()), 'creator_secret');
};

/**
 * Build a pool deployment. The maintenance committee is always empty with
 * threshold 1, so nobody can ever replace the pool's verifier keys.
 */
export const buildCreatePoolTx = async ({
  wallet,
  tokenA,
  tokenB,
  lpFeeBps = 30,
  orderBondToken,
  orderBondAmount,
  creatorSecret,
  authority = NORTHSTAR_POOL_AUTHORITY,
  txTtlSeconds = 3600,
}: CreatePoolOptions & { wallet: NorthStarWallet; txTtlSeconds?: number }): Promise<BuiltOrderTx> => {
  const tokens = [tokenA, tokenB, orderBondToken].map((token, index) => {
    assertCustomToken(token);
    return nonzeroBytes32Hex(token, ['token_a', 'token_b', 'order_bond_token'][index]);
  });
  if (tokens[0] === tokens[1]) throw new Error('pool_tokens_must_differ');
  const ids = [
    nonzeroBytes32Hex(authority.masterAuthId, 'master_auth_id'),
    nonzeroBytes32Hex(authority.batcherAuthId, 'batcher_auth_id'),
    unshieldedAddressHex(authority.protocolFeeRecipient, 'protocol_fee_recipient'),
  ];
  const bondAmount = positive(orderBondAmount, 'order_bond_amount');
  const secret = resolveCreatorSecret(wallet, creatorSecret, () => ({
    tokenA: tokens[0],
    tokenB: tokens[1],
    lpFeeBps,
    orderBondToken: tokens[2],
    orderBondAmount: bondAmount,
  }));
  const release = assertAuditedArtifacts(DEFAULT_COMPILED_DIR);
  const compiled = (await loadCompiledModule(release.compiledDir)) as CompiledModule;
  const secretBytes = bytes32FromHex(secret, 'creator_secret');
  try {
    const contract = new compiled.Contract(makeWitnessBundle({ creatorSecretBytes: secretBytes }) as never);
    const result = contract.initialState(
      createConstructorContext({}, wallet.coinPublicKey) as never,
      bytes32FromHex(tokens[0], 'token_a'),
      bytes32FromHex(tokens[1], 'token_b'),
      BigInt(lpFeeBps),
      bytes32FromHex(ids[0], 'master_auth_id'),
      bytes32FromHex(ids[1], 'batcher_auth_id'),
      bytes32FromHex(ids[2], 'protocol_fee_recipient'),
      bytes32FromHex(tokens[2], 'order_bond_token'),
      bondAmount,
    );
    const state = result.currentContractState;
    const zswap = decodeZswapLocalState(result.currentZswapLocalState);
    if (zswap.inputs.length !== 0 || zswap.outputs.length !== 0 || state.balance.size !== 0) {
      throw new Error('pool_constructor_has_effects');
    }
    for (const circuit of release.releaseCircuits) {
      const operation = state.operation(circuit);
      if (operation == null) throw new Error(`pool_constructor_circuit_missing:${circuit}`);
      operation.verifierKey = readFileSync(path.join(release.compiledDir, 'keys', `${circuit}.verifier`));
      state.setOperation(circuit, operation);
    }
    state.maintenanceAuthority = new ContractMaintenanceAuthority([], 1, 0n);
    const deployment = new ContractDeploy(LedgerContractState.deserialize(state.serialize()));
    const authorityState = deployment.initialState.maintenanceAuthority;
    if (authorityState.committee.length !== 0 || authorityState.threshold !== 1)
      throw new Error('pool_committee_not_empty');
    assertCompatibleContractState(deployment.initialState, release.compiledDir);
    const ledger = compiled.ledger(state.data as never);
    if (
      hexFromBytes(ledger.deployerAuthId) !== poolCreatorId(secret) ||
      hexFromBytes(ledger.masterAuthId) !== ids[0] ||
      hexFromBytes(ledger.protocolFeeRecipientBytes) !== ids[2] ||
      !ledger.authorizedBatchers.member(bytes32FromHex(ids[1], 'batcher_auth_id'))
    ) {
      throw new Error('pool_constructor_state_mismatch');
    }
    const ttl = new Date(Date.now() + txTtlSeconds * 1000);
    const unprovenTx = Transaction.fromParts(
      'mainnet',
      undefined,
      undefined,
      Intent.new(ttl).addDeploy(deployment),
    );
    return {
      kind: 'createPool',
      orderId: null,
      cancelSecret: null,
      creatorSecret: secret,
      quote: null,
      built: {
        contractAddress: String(deployment.address),
        releaseId: release.releaseId,
        sourceSha256: release.sourceSha256,
        compiledDir: release.compiledDir,
        circuitId: 'deploy',
        unprovenTx,
      },
    };
  } finally {
    secretBytes.fill(0);
  }
};

/** Build the creator's one-time first deposit into an empty pool. */
export const buildFundPoolTx = async ({
  wallet,
  environment,
  pool,
  amountA,
  amountB,
  creatorSecret,
  minLp,
}: FundPoolOptions & { wallet: NorthStarWallet; environment: Environment }): Promise<BuiltOrderTx> => {
  if (creatorSecret != null) nonzeroBytes32Hex(creatorSecret, 'creator_secret');
  const a = positive(amountA, 'amount_a');
  const b = positive(amountB, 'amount_b');
  const lp = minLp == null ? initialLpOut(a, b) : positive(minLp, 'min_lp');
  const state = await readPool({ contractAddress: pool, environment });
  const ledger = state.ledger;
  if (!state.exists || ledger == null) throw new Error(`pool_not_found:${pool}`);
  const secret = resolveCreatorSecret(wallet, creatorSecret, () => ({
    tokenA: String(ledger.tokenTypeA),
    tokenB: String(ledger.tokenTypeB),
    lpFeeBps: String(ledger.lpFeeBps),
    orderBondToken: String(ledger.orderBondTokenType),
    orderBondAmount: String(ledger.orderBondAmount),
  }));
  if (ledger.deployerAuthId !== poolCreatorId(secret)) throw new Error('pool_creator_secret_mismatch');
  if (String(ledger.totalLPSupply) !== '0') throw new Error('pool_already_funded');
  const recipient = nonzeroBytes32Hex(wallet.unshieldedAddressHex, 'recipient');
  return {
    kind: 'fundPool',
    orderId: null,
    cancelSecret: null,
    creatorSecret: secret,
    quote: null,
    built: await buildUserActionTx({
      wallet,
      contractAddress: pool,
      circuitId: 'depositLiquidity',
      creatorSecret: secret,
      environment,
      args: () => [a, b, lp, bytes32FromHex(recipient, 'recipient')],
    }),
  };
};
