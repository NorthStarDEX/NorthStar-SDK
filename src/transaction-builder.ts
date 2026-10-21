import { randomBytes } from 'node:crypto';

import * as CompactJS from '@midnight-ntwrk/compact-js/effect';
import { createUnprovenCallTx } from '@midnight-ntwrk/midnight-js-contracts';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { MidnightBech32m, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';

import {
  assertCompatibleContractState,
  assertSingleCompactRuntime,
  DEFAULT_COMPILED_DIR,
  loadCompiledModule,
  selectCompatibleRelease,
} from './internal/artifacts.js';
import { NORTHSTAR_POOL_AUTHORITY } from './internal/authority.js';
import { readFinalizedChainTime } from './internal/chain-time.js';
import { bytes32FromHex, hexFromBytes, normalizeBytes32Hex } from './internal/common.js';
import { guardedPublicDataProvider, type Environment } from './internal/environment.js';
import {
  liquidityAdmissionTiming,
  publicLiquidityState,
  requireLiquidityAdmissionWindow,
} from './internal/liquidity-timing.js';
import { assertStateTokenScope, createReadProviders, readPoolState } from './internal/pool-state.js';
import {
  applySlippageBps,
  checkSlippageBps,
  quoteLiquidityOrder,
  quoteSwapOrder,
} from './internal/quotes.js';
import type { UnknownRecord } from './internal/types.js';
import { makeWitnessBundle, type PoolSettings } from './internal/wallet-secrets.js';
import type { Direction, ProvableCircuits } from '../artifacts/NorthStarDEX/contract/index.js';

/** A token amount in base units. */
export type Amount = bigint | number | string;

/** `AtoB` pays token A and receives token B; `BtoA` the reverse. */
export type SwapDirection = 'AtoB' | 'BtoA';

/** The wallet keys a transaction needs. */
export type NorthStarWallet = {
  unshieldedAddressHex: string;
  coinPublicKey: string;
  encryptionPublicKey: string;
  /** Derives the wallet's cancel secret for an order when none is passed. */
  cancelSecret?: (pool: string, orderId: string) => string;
  /** Derives the wallet's creator secret for a pool when none is passed. */
  creatorSecret?: (settings: PoolSettings) => string;
};

type OrderOptions = {
  /** Random by default. */
  orderId?: string;
  /** Derived from your seed by default. If you pass your own, store it to cancel the order. */
  cancelSecret?: string;
  /** Gets the bond back, and the input if the order is cancelled. Default: your wallet. */
  owner?: string;
  /** Gets the output. Default: your wallet. */
  recipient?: string;
};

export type SwapQuoteOptions = {
  pool: string;
  direction: SwapDirection;
  /** At least 1,000 base units. */
  amountIn: Amount;
  /** Smallest output the order accepts. Pass this or `slippageBps`. */
  minAmountOut?: Amount;
  /** Allowed drop from the current quote, in basis points (100 = 1%). Pass this or `minAmountOut`. */
  slippageBps?: number;
  /** Order lifetime in seconds. Default 21 days, at most 30. */
  ttlSeconds?: number;
};

export type SwapOrderOptions = SwapQuoteOptions & OrderOptions;

export type AddLiquidityTerms = {
  kind: 'add';
  amountA: Amount;
  amountB: Amount;
  /** Fewest LP tokens the order accepts. Pass this or `slippageBps`. */
  minLp?: Amount;
  /** Allowed drop from the current quote, in basis points (100 = 1%). Pass this or `minLp`. */
  slippageBps?: number;
};

export type RemoveLiquidityTerms = {
  kind: 'remove';
  lp: Amount;
  /** Fewest token A and token B the order accepts. Pass both, or `slippageBps`. */
  minA?: Amount;
  minB?: Amount;
  /** Allowed drop from the current quote, in basis points (100 = 1%). Pass this or `minA` and `minB`. */
  slippageBps?: number;
};

export type LiquidityQuoteOptions = (AddLiquidityTerms | RemoveLiquidityTerms) & {
  pool: string;
  /** Order lifetime in seconds. Default 40 days. */
  ttlSeconds?: number;
};

export type LiquidityOrderOptions = LiquidityQuoteOptions & OrderOptions;

export type CancelOrderOptions = {
  pool: string;
  orderId: string;
  /** Needed only for an order placed with your own secret. Expired orders take any secret. */
  cancelSecret?: string;
};

export type SwapQuote = {
  pool: string;
  direction: SwapDirection;
  amountIn: string;
  /** Output at the current reserves, or null if the pool cannot fill this trade now. */
  expectedOut: string | null;
  /** The smallest output the order accepts. */
  minAmountOut: string;
  /** Unix time in seconds; the order cannot fill after it. */
  deadline: string;
};

type LiquidityTiming = {
  /** Unix time in seconds; the order cannot fill after it. */
  deadline: string;
  /** Unix time in seconds after which anyone may settle the order. */
  publicSettleAfter: string;
};

export type LiquidityQuote =
  | ({
      pool: string;
      kind: 'add';
      amountA: string;
      amountB: string;
      minLp: string;
      /** LP tokens at the current reserves, or null if the pool cannot fill this order now. */
      expectedLp: string | null;
    } & LiquidityTiming)
  | ({
      pool: string;
      kind: 'remove';
      lp: string;
      minA: string;
      minB: string;
      /** Outputs at the current reserves, or null if the pool cannot fill this order now. */
      expectedA: string | null;
      expectedB: string | null;
    } & LiquidityTiming);

export type PoolPrice = {
  pool: string;
  tokenA: string;
  tokenB: string;
  reserveA: string;
  reserveB: string;
  lpFeeBps: string;
  priceBPerA: number | null;
  priceAPerB: number | null;
};

export type PoolInfo = PoolPrice & {
  lpToken: string;
  totalLp: string;
  protocolFeeShareBps: string;
  /** Locked by every order and returned when it settles or is cancelled. */
  orderBond: { token: string; amount: string };
  openOrders: number;
  /** Who controls the pool. Pools made by `createPool` with its defaults have NorthStar's values. */
  authority: { masterAuthId: string; batcherAuthIds: string[]; protocolFeeRecipient: string };
  /** True when nobody can ever change the pool's verifier keys. */
  maintenanceLocked: boolean;
  /** True when NorthStar's batcher settles this pool: NorthStar's master, batcher and fee recipient on a locked pool. */
  servedByNorthStar: boolean;
};

type OrderParties = { orderId: string; owner: string; recipient: string; deadline: string };

export type PoolOrder =
  | (OrderParties & { kind: 'swap'; direction: SwapDirection; amountIn: string; minAmountOut: string })
  | (OrderParties & {
      kind: 'add';
      amountA: string;
      amountB: string;
      minLp: string;
      publicSettleAfter: string | null;
    })
  | (OrderParties & {
      kind: 'remove';
      lp: string;
      minA: string;
      minB: string;
      publicSettleAfter: string | null;
    });

export type OrderKind =
  | 'swap'
  | 'cancelSwap'
  | 'addLiquidity'
  | 'removeLiquidity'
  | 'cancelLiquidity'
  | 'settleLiquidity'
  | 'createPool'
  | 'fundPool';

export type CompiledModule = typeof import('../artifacts/NorthStarDEX/contract/index.js');
type UserCircuit =
  | 'depositOrder'
  | 'cancelOrder'
  | 'liquidityOrder'
  | 'cancelLiquidityOrder'
  | 'settleLiquidityOrder'
  | 'depositLiquidity';
type CircuitArgs<K extends UserCircuit> =
  Parameters<ProvableCircuits<UnknownRecord>[K]> extends [unknown, ...infer A] ? A : never;

export type BuiltCallTx = {
  contractAddress: string;
  releaseId: string;
  sourceSha256: string;
  compiledDir: string;
  circuitId: string;
  unprovenTx: unknown;
};

export type BuiltOrderTx = {
  kind: OrderKind;
  orderId: string | null;
  cancelSecret: string | null;
  creatorSecret?: string;
  quote: SwapQuote | LiquidityQuote | null;
  /** Liquidity orders only: checked again just before submission. */
  creationTimeUpperBound?: string;
  built: BuiltCallTx;
};

export type BuilderConfig = {
  environment: Environment;
  compiledDir?: string;
  compiledModule?: CompiledModule | null;
};

type BuildUserActionTxOptions<K extends UserCircuit> = BuilderConfig & {
  wallet: NorthStarWallet;
  contractAddress: string;
  circuitId: K;
  args: (compiledModule: CompiledModule) => readonly unknown[];
  cancelSecret?: string | null;
  creatorSecret?: string | null;
};

export type ReadPoolOptions = Pick<BuilderConfig, 'environment' | 'compiledDir' | 'compiledModule'> & {
  contractAddress: string;
};

export type PoolState = {
  contractAddress: string;
  exists: boolean;
  releaseId?: string | null;
  sourceSha256?: string | null;
  ledger: Record<string, unknown> | null;
  maintenanceLocked?: boolean;
  derived: {
    priceBPerA: number | null;
    priceAPerB: number | null;
  };
};

type PoolBuilderConfig = BuilderConfig & { wallet: NorthStarWallet; poolState?: PoolState | null };

export const DEFAULT_ORDER_TTL_SECONDS = 1_814_400;
export const randomOrderId = () => randomBytes(32).toString('hex');
export const MAX_ORDER_TTL_SECONDS = 2_592_000;
export const deadlineFromSeconds = (ttlSeconds = DEFAULT_ORDER_TTL_SECONDS) => {
  if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > MAX_ORDER_TTL_SECONDS) {
    throw new Error('order_ttl_seconds_out_of_range');
  }
  return String(Math.floor(Date.now() / 1000) + ttlSeconds);
};

const uint64 = (value: Amount, label: string, minimum = 0n): bigint => {
  if (typeof value === 'number' && !Number.isSafeInteger(value))
    throw new Error(`${label}_must_be_safe_integer`);
  if (!/^\d+$/u.test(String(value))) throw new Error(`${label}_must_be_unsigned_integer`);
  const result = BigInt(value);
  if (result < minimum || result > (1n << 64n) - 1n) throw new Error(`${label}_out_of_range`);
  return result;
};

const poolAddress = (pool: string): string => normalizeBytes32Hex(pool, 'pool');

export const nonzeroBytes32Hex = (value: string, label: string): string => {
  const normalized = normalizeBytes32Hex(value, label);
  if (/^0+$/u.test(normalized)) throw new Error(`${label}_must_not_be_zero`);
  return normalized;
};

// An unshielded address as 32-byte hex or as an mn_addr1... address.
export const unshieldedAddressHex = (value: string, label: string): string => {
  const text = String(value).trim();
  if (!text.startsWith('mn_addr')) return nonzeroBytes32Hex(text, label);
  let bytes: Buffer;
  try {
    bytes = MidnightBech32m.parse(text).decode(UnshieldedAddress, 'mainnet').data;
  } catch {
    throw new Error(`${label}_invalid`);
  }
  return nonzeroBytes32Hex(bytes.toString('hex'), label);
};

export const normalizeSwapDirection = (direction: unknown): { name: SwapDirection; value: 0 | 1 } => {
  if (direction === 'AtoB') return { name: 'AtoB', value: 0 };
  if (direction === 'BtoA') return { name: 'BtoA', value: 1 };
  throw new Error(`swap_direction_must_be_AtoB_or_BtoA:${String(direction)}`);
};

// Like a swap, every liquidity order carries a price limit: its minimums, or
// slippageBps applied to the current quote. Checked before any network read.
const checkLiquidityTerms = (terms: AddLiquidityTerms | RemoveLiquidityTerms): void => {
  if (terms?.kind === 'add') {
    uint64(terms.amountA, 'amount_a', 1n);
    uint64(terms.amountB, 'amount_b', 1n);
    if (terms.minLp == null && terms.slippageBps == null) throw new Error('min_lp_or_slippage_bps_required');
    if (terms.minLp != null && terms.slippageBps != null) throw new Error('min_lp_and_slippage_bps_both_set');
    if (terms.minLp != null) uint64(terms.minLp, 'min_lp', 1n);
    else checkSlippageBps(terms.slippageBps!);
    return;
  }
  if (terms?.kind === 'remove') {
    uint64(terms.lp, 'lp', 1n);
    const minimums = [terms.minA, terms.minB].filter((value) => value != null).length;
    if (minimums === 1) throw new Error('min_a_and_min_b_go_together');
    if (minimums === 0 && terms.slippageBps == null)
      throw new Error('min_a_and_min_b_or_slippage_bps_required');
    if (minimums === 2 && terms.slippageBps != null)
      throw new Error('min_a_and_min_b_and_slippage_bps_both_set');
    if (minimums === 2) {
      uint64(terms.minA!, 'min_a');
      uint64(terms.minB!, 'min_b');
    } else checkSlippageBps(terms.slippageBps!);
    return;
  }
  throw new Error(`liquidity_kind_must_be_add_or_remove:${String((terms as { kind?: unknown })?.kind)}`);
};

// An explicit secret wins; otherwise the wallet derives the order's secret from
// its seed. The contract skips the secret check once an order has expired.
const resolveCancelSecret = (
  wallet: NorthStarWallet,
  pool: string,
  orderId: string,
  cancelSecret: string | null | undefined,
): string => {
  if (cancelSecret != null) return nonzeroBytes32Hex(cancelSecret, 'cancel_secret');
  if (wallet.cancelSecret == null) throw new Error('cancel_secret_required');
  return nonzeroBytes32Hex(
    wallet.cancelSecret(normalizeBytes32Hex(pool, 'contract_address'), orderId),
    'cancel_secret',
  );
};

function assertPoolReady(pool: PoolState): asserts pool is PoolState & { ledger: Record<string, unknown> } {
  if (pool.exists !== true || pool.ledger == null) {
    throw new Error(`pool_not_found:${pool.contractAddress}`);
  }
}

const buildCompiledPoolContract = ({
  compiledModule,
  compiledDir = DEFAULT_COMPILED_DIR,
  cancelSecretBytes = null,
  creatorSecretBytes = null,
}: {
  compiledModule: CompiledModule;
  compiledDir?: string;
  cancelSecretBytes?: Uint8Array | null;
  creatorSecretBytes?: Uint8Array | null;
}): unknown =>
  CompactJS.CompiledContract.make('NorthStarDEX', compiledModule.Contract).pipe(
    CompactJS.CompiledContract.withWitnesses(makeWitnessBundle({ cancelSecretBytes, creatorSecretBytes })),
    CompactJS.CompiledContract.withCompiledFileAssets(compiledDir),
  );

const contractDirection = (compiledModule: CompiledModule, value: string): Direction => {
  if (compiledModule.Direction == null) throw new Error('compiled_module_direction_missing');
  if (Object.hasOwn(compiledModule.Direction, value))
    return compiledModule.Direction[value as keyof typeof compiledModule.Direction];
  throw new Error(`unsupported_direction:${value}`);
};

// The contract keeps no private state, so calls need no private-state store.
const createBuilderProviders = ({
  wallet,
  environment,
  compiledDir = DEFAULT_COMPILED_DIR,
}: {
  wallet: NorthStarWallet;
  environment: Environment;
  compiledDir?: string;
}) => {
  setNetworkId(environment.networkId);
  return {
    publicDataProvider: guardedPublicDataProvider(
      indexerPublicDataProvider(environment.indexer, environment.indexerWS),
      environment,
    ),
    zkConfigProvider: new NodeZkConfigProvider(compiledDir),
    walletProvider: {
      getCoinPublicKey: () => wallet.coinPublicKey,
      getEncryptionPublicKey: () => wallet.encryptionPublicKey,
    },
  };
};

export const buildUserActionTx = async <K extends UserCircuit>({
  wallet,
  contractAddress,
  circuitId,
  args,
  cancelSecret = null,
  creatorSecret = null,
  environment,
  compiledDir,
  compiledModule = null,
}: BuildUserActionTxOptions<K>): Promise<BuiltCallTx> => {
  assertSingleCompactRuntime();
  const normalizedContractAddress = normalizeBytes32Hex(contractAddress, 'contract_address');
  const readProviders = createReadProviders({ environment });
  const currentState = await readProviders.publicDataProvider.queryContractState(normalizedContractAddress);
  if (currentState == null) throw new Error(`pool_not_found:${normalizedContractAddress}`);
  const release = selectCompatibleRelease(currentState, compiledDir);
  const moduleToUse = (await loadCompiledModule(release.compiledDir)) as CompiledModule;
  if (compiledModule != null && compiledModule !== moduleToUse) {
    throw new Error('amm_compiled_module_release_mismatch');
  }
  assertStateTokenScope(moduleToUse, currentState);
  const cancelSecretBytes = cancelSecret == null ? null : bytes32FromHex(cancelSecret, 'cancel_secret');
  const creatorSecretBytes = creatorSecret == null ? null : bytes32FromHex(creatorSecret, 'creator_secret');
  try {
    const compiledContract = buildCompiledPoolContract({
      compiledModule: moduleToUse,
      compiledDir: release.compiledDir,
      cancelSecretBytes,
      creatorSecretBytes,
    });
    const providers = createBuilderProviders({ wallet, environment, compiledDir: release.compiledDir });
    // Midnight.js reads the state again while building; check every read.
    const queryContractState = providers.publicDataProvider.queryContractState.bind(
      providers.publicDataProvider,
    );
    providers.publicDataProvider.queryContractState = async (...parameters) => {
      const state = await queryContractState(...parameters);
      if (state == null) throw new Error(`pool_not_found:${normalizedContractAddress}`);
      assertCompatibleContractState(state, release.compiledDir);
      assertStateTokenScope(moduleToUse, state);
      return state;
    };
    const queryZSwapAndContractState = providers.publicDataProvider.queryZSwapAndContractState.bind(
      providers.publicDataProvider,
    );
    providers.publicDataProvider.queryZSwapAndContractState = async (...parameters) => {
      const states = await queryZSwapAndContractState(...parameters);
      if (states == null) throw new Error(`pool_not_found:${normalizedContractAddress}`);
      assertCompatibleContractState(states[1], release.compiledDir);
      assertStateTokenScope(moduleToUse, states[1]);
      return states;
    };
    const callArgs = args(moduleToUse);
    if (circuitId === 'liquidityOrder')
      requireLiquidityAdmissionWindow(
        await readFinalizedChainTime(environment),
        BigInt(String(callArgs[8])),
        BigInt(String(callArgs[7])),
      );
    if (circuitId === 'settleLiquidityOrder') {
      const pool = await readPool({ contractAddress, environment, compiledDir: release.compiledDir });
      const id = hexFromBytes(callArgs[0] as Uint8Array);
      const order = (pool.ledger?.orderBookEntries as UnknownRecord[]).find((entry) => entry.orderId === id);
      const time = await readFinalizedChainTime(environment);
      if (publicLiquidityState((order as never) ?? null, time) !== 'mature')
        throw new Error('public_liquidity_not_mature');
      const q = quoteLiquidityOrder({
        order: order as never,
        reserveA: String(pool.ledger?.reserveA),
        reserveB: String(pool.ledger?.reserveB),
        totalLPSupply: String(pool.ledger?.totalLPSupply),
        now: new Date(Number(time) * 1000),
      });
      if (!q.eligible) throw new Error('public_liquidity_unfillable:' + q.reason);
    }
    const callTxData = await createUnprovenCallTx(providers, {
      compiledContract,
      contractAddress: normalizedContractAddress,
      circuitId,
      args: callArgs as never,
    });
    return {
      contractAddress: normalizedContractAddress,
      releaseId: release.releaseId,
      sourceSha256: release.sourceSha256,
      compiledDir: release.compiledDir,
      circuitId,
      unprovenTx: callTxData.private.unprovenTx,
    };
  } finally {
    cancelSecretBytes?.fill?.(0);
    creatorSecretBytes?.fill?.(0);
  }
};

export const readPool = async ({
  contractAddress,
  environment,
  compiledDir,
  compiledModule = null,
}: ReadPoolOptions): Promise<PoolState> =>
  (await readPoolState({
    contractAddress: normalizeBytes32Hex(contractAddress, 'contract_address'),
    environment,
    compiledDir,
    compiledModule,
  })) as PoolState;

const readReadyPool = async (environment: Environment, pool: string) => {
  const state = await readPool({ contractAddress: poolAddress(pool), environment });
  assertPoolReady(state);
  return state;
};

export const getPoolPrice = async ({
  environment,
  pool,
}: {
  environment: Environment;
  pool: string;
}): Promise<PoolPrice> => {
  const state = await readReadyPool(environment, pool);
  return {
    pool: state.contractAddress,
    tokenA: String(state.ledger.tokenTypeA),
    tokenB: String(state.ledger.tokenTypeB),
    reserveA: String(state.ledger.reserveA),
    reserveB: String(state.ledger.reserveB),
    lpFeeBps: String(state.ledger.lpFeeBps),
    priceBPerA: state.derived.priceBPerA,
    priceAPerB: state.derived.priceAPerB,
  };
};

export const getPool = async ({
  environment,
  pool,
}: {
  environment: Environment;
  pool: string;
}): Promise<PoolInfo> => {
  const state = await readReadyPool(environment, pool);
  const { ledger } = state;
  const authority = {
    masterAuthId: String(ledger.masterAuthId),
    batcherAuthIds: ledger.batcherAuthIds as string[],
    protocolFeeRecipient: String(ledger.protocolFeeRecipient),
  };
  const maintenanceLocked = state.maintenanceLocked === true;
  return {
    pool: state.contractAddress,
    tokenA: String(ledger.tokenTypeA),
    tokenB: String(ledger.tokenTypeB),
    reserveA: String(ledger.reserveA),
    reserveB: String(ledger.reserveB),
    lpFeeBps: String(ledger.lpFeeBps),
    priceBPerA: state.derived.priceBPerA,
    priceAPerB: state.derived.priceAPerB,
    lpToken: String(ledger.lpTokenType),
    totalLp: String(ledger.totalLPSupply),
    protocolFeeShareBps: String(ledger.protocolFeeShareBps),
    orderBond: { token: String(ledger.orderBondTokenType), amount: String(ledger.orderBondAmount) },
    openOrders: Number(ledger.orderBookSize),
    authority,
    maintenanceLocked,
    servedByNorthStar:
      maintenanceLocked &&
      authority.masterAuthId === NORTHSTAR_POOL_AUTHORITY.masterAuthId &&
      authority.protocolFeeRecipient === NORTHSTAR_POOL_AUTHORITY.protocolFeeRecipient &&
      authority.batcherAuthIds.includes(NORTHSTAR_POOL_AUTHORITY.batcherAuthId),
  };
};

const poolOrder = (entry: UnknownRecord): PoolOrder => {
  const parties = {
    orderId: String(entry.orderId),
    owner: String(entry.owner),
    recipient: String(entry.recipient),
    deadline: String(entry.deadline),
  };
  const publicSettleAfter = entry.publicSettleAfter == null ? null : String(entry.publicSettleAfter);
  const [amountIn, amountAux, minAmountOut] = [entry.amountIn, entry.amountAux, entry.minAmountOut].map(
    String,
  );
  if (entry.direction === 2)
    return {
      ...parties,
      kind: 'add',
      amountA: amountIn,
      amountB: amountAux,
      minLp: minAmountOut,
      publicSettleAfter,
    };
  if (entry.direction === 3)
    return {
      ...parties,
      kind: 'remove',
      lp: amountIn,
      minA: amountAux,
      minB: minAmountOut,
      publicSettleAfter,
    };
  return {
    ...parties,
    kind: 'swap',
    direction: entry.direction === 0 ? 'AtoB' : 'BtoA',
    amountIn,
    minAmountOut,
  };
};

/** An open order, or null once it has settled, been cancelled or never existed. */
export const getOrder = async ({
  environment,
  pool,
  orderId,
}: {
  environment: Environment;
  pool: string;
  orderId: string;
}): Promise<PoolOrder | null> => {
  const id = normalizeBytes32Hex(orderId, 'order_id');
  const state = await readReadyPool(environment, pool);
  const entry = (state.ledger.orderBookEntries as UnknownRecord[]).find((order) => order.orderId === id);
  return entry == null ? null : poolOrder(entry);
};

// Every swap order names its direction and carries a price limit: an explicit
// minAmountOut, or slippageBps applied to the current quote. Checked before any
// network read.
const checkSwapOptions = ({
  direction,
  amountIn,
  minAmountOut,
  slippageBps,
}: Pick<SwapQuoteOptions, 'direction' | 'amountIn' | 'minAmountOut' | 'slippageBps'>): void => {
  normalizeSwapDirection(direction);
  uint64(amountIn, 'amount_in', 1000n);
  if (minAmountOut == null && slippageBps == null) throw new Error('min_amount_out_or_slippage_bps_required');
  if (minAmountOut != null && slippageBps != null)
    throw new Error('min_amount_out_and_slippage_bps_both_set');
  if (minAmountOut != null) uint64(minAmountOut, 'min_amount_out', 1n);
  else checkSlippageBps(slippageBps);
};

// Quotes and swap orders both use this, so a quote shows the exact minimum
// the order will carry.
const swapQuoteFromPool = (
  state: PoolState,
  {
    direction,
    amountIn,
    minAmountOut,
    slippageBps,
    ttlSeconds = DEFAULT_ORDER_TTL_SECONDS,
  }: SwapQuoteOptions,
): SwapQuote => {
  assertPoolReady(state);
  checkSwapOptions({ direction, amountIn, minAmountOut, slippageBps });
  const swapDirection = normalizeSwapDirection(direction);
  const deadline = deadlineFromSeconds(ttlSeconds);
  const input = uint64(amountIn, 'amount_in', 1000n).toString();
  const market = quoteSwapOrder({
    order: { direction: swapDirection.value, amountIn: input, minAmountOut: '1', deadline },
    reserveA: String(state.ledger.reserveA ?? '0'),
    reserveB: String(state.ledger.reserveB ?? '0'),
    lpFeeBps: String(state.ledger.lpFeeBps ?? '0'),
    protocolFeeShareBps: String(state.ledger.protocolFeeShareBps ?? '0'),
  });
  const expectedOut = market.eligible === true ? market.quotedAmountOut! : null;
  let resolvedMinAmountOut: string;
  if (minAmountOut != null) {
    resolvedMinAmountOut = uint64(minAmountOut, 'min_amount_out', 1n).toString();
  } else {
    if (expectedOut == null) throw new Error(`swap_quote_unavailable:${market.reason}`);
    resolvedMinAmountOut = applySlippageBps({ quotedAmount: expectedOut, slippageBps });
  }
  return {
    pool: state.contractAddress,
    direction: swapDirection.name,
    amountIn: input,
    expectedOut,
    minAmountOut: resolvedMinAmountOut,
    deadline,
  };
};

export const quoteSwap = async ({
  environment,
  ...options
}: SwapQuoteOptions & { environment: Environment }): Promise<SwapQuote> => {
  const address = poolAddress(options.pool);
  checkSwapOptions(options);
  return swapQuoteFromPool(await readPool({ contractAddress: address, environment }), options);
};

// Quotes and liquidity orders both use this, so a quote shows the exact
// minimums the order will carry. The contract stores both kinds in the same
// three order fields.
const liquidityQuoteFromPool = (state: PoolState, options: LiquidityQuoteOptions, chainSeconds: bigint) => {
  assertPoolReady(state);
  checkLiquidityTerms(options);
  const add = options.kind === 'add';
  const amountIn = add ? uint64(options.amountA, 'amount_a', 1n) : uint64(options.lp, 'lp', 1n);
  const amountB = add ? uint64(options.amountB, 'amount_b', 1n) : 0n;
  const timing = liquidityAdmissionTiming(chainSeconds, options.ttlSeconds);
  const deadline = String(timing.deadline);
  // The market quote ignores the order's minimums, to show the expected amounts.
  const market = quoteLiquidityOrder({
    order: {
      direction: add ? 2 : 3,
      amountIn: String(amountIn),
      amountAux: String(amountB),
      minAmountOut: add ? '1' : '0',
      deadline,
    },
    reserveA: String(state.ledger.reserveA ?? '0'),
    reserveB: String(state.ledger.reserveB ?? '0'),
    totalLPSupply: String(state.ledger.totalLPSupply ?? '0'),
  });
  const filled = market.eligible === true;
  // An explicit minimum wins; otherwise slippageBps applies to the quote.
  const limit = (explicit: Amount | undefined, quoted: string | undefined, label: string, floor: bigint) => {
    if (explicit != null) return uint64(explicit, label, floor);
    if (!filled || quoted == null) throw new Error(`liquidity_quote_unavailable:${market.reason}`);
    return BigInt(
      applySlippageBps({ quotedAmount: quoted, slippageBps: options.slippageBps!, minimum: floor }),
    );
  };
  const shared = {
    pool: state.contractAddress,
    deadline,
    publicSettleAfter: String(timing.publicSettleAfter),
  };
  const creationTimeUpperBound = String(timing.creationTimeUpperBound);
  if (options.kind === 'add') {
    const minLp = limit(options.minLp, market.quotedLpOut, 'min_lp', 1n);
    return {
      quote: {
        ...shared,
        kind: 'add',
        amountA: String(amountIn),
        amountB: String(amountB),
        minLp: String(minLp),
        expectedLp: filled ? market.quotedLpOut! : null,
      } satisfies LiquidityQuote,
      fields: { direction: 'LiquidityAdd' as const, amountIn, amountAux: amountB, minAmountOut: minLp },
      creationTimeUpperBound,
    };
  }
  const minA = limit(options.minA, market.quotedAmountAOut, 'min_a', 0n);
  const minB = limit(options.minB, market.quotedAmountBOut, 'min_b', 0n);
  return {
    quote: {
      ...shared,
      kind: 'remove',
      lp: String(amountIn),
      minA: String(minA),
      minB: String(minB),
      expectedA: filled ? market.quotedAmountAOut! : null,
      expectedB: filled ? market.quotedAmountBOut! : null,
    } satisfies LiquidityQuote,
    fields: { direction: 'LiquidityRemove' as const, amountIn, amountAux: minA, minAmountOut: minB },
    creationTimeUpperBound,
  };
};

export const quoteLiquidity = async ({
  environment,
  ...options
}: LiquidityQuoteOptions & { environment: Environment }): Promise<LiquidityQuote> => {
  const address = poolAddress(options.pool);
  checkLiquidityTerms(options);
  const state = await readPool({ contractAddress: address, environment });
  return liquidityQuoteFromPool(state, options, await readFinalizedChainTime(environment)).quote;
};

const orderParties = (wallet: NorthStarWallet, owner?: string, recipient?: string) => ({
  owner:
    owner == null
      ? nonzeroBytes32Hex(wallet.unshieldedAddressHex, 'owner')
      : unshieldedAddressHex(owner, 'owner'),
  recipient:
    recipient == null
      ? nonzeroBytes32Hex(wallet.unshieldedAddressHex, 'recipient')
      : unshieldedAddressHex(recipient, 'recipient'),
});

export const buildDepositOrderTx = async ({
  wallet,
  environment,
  compiledDir,
  compiledModule = null,
  poolState = null,
  orderId = randomOrderId(),
  cancelSecret,
  owner,
  recipient,
  ...options
}: SwapOrderOptions & PoolBuilderConfig): Promise<BuiltOrderTx> => {
  poolAddress(options.pool);
  checkSwapOptions(options);
  const normalizedOrderId = nonzeroBytes32Hex(orderId, 'order_id');
  const normalizedCancelSecret = resolveCancelSecret(wallet, options.pool, normalizedOrderId, cancelSecret);
  const parties = orderParties(wallet, owner, recipient);
  const state =
    poolState ??
    (await readPool({ contractAddress: options.pool, environment, compiledDir, compiledModule }));
  const quote = swapQuoteFromPool(state, options);
  return {
    kind: 'swap',
    orderId: normalizedOrderId,
    cancelSecret: normalizedCancelSecret,
    quote,
    built: await buildUserActionTx({
      wallet,
      contractAddress: options.pool,
      circuitId: 'depositOrder',
      cancelSecret: normalizedCancelSecret,
      environment,
      compiledDir,
      compiledModule,
      args: (moduleToUse): CircuitArgs<'depositOrder'> => [
        bytes32FromHex(normalizedOrderId, 'order_id'),
        contractDirection(moduleToUse, quote.direction),
        BigInt(quote.amountIn),
        BigInt(quote.minAmountOut),
        bytes32FromHex(parties.recipient, 'recipient'),
        bytes32FromHex(parties.owner, 'owner'),
        BigInt(quote.deadline),
      ],
    }),
  };
};

export const buildLiquidityOrderTx = async ({
  wallet,
  environment,
  compiledDir,
  compiledModule = null,
  poolState = null,
  orderId = randomOrderId(),
  cancelSecret,
  owner,
  recipient,
  ...options
}: LiquidityOrderOptions & PoolBuilderConfig): Promise<BuiltOrderTx> => {
  poolAddress(options.pool);
  checkLiquidityTerms(options);
  const normalizedOrderId = nonzeroBytes32Hex(orderId, 'order_id');
  const normalizedCancelSecret = resolveCancelSecret(wallet, options.pool, normalizedOrderId, cancelSecret);
  const parties = orderParties(wallet, owner, recipient);
  const state =
    poolState ??
    (await readPool({ contractAddress: options.pool, environment, compiledDir, compiledModule }));
  const { quote, fields, creationTimeUpperBound } = liquidityQuoteFromPool(
    state,
    options,
    await readFinalizedChainTime(environment),
  );
  return {
    kind: options.kind === 'add' ? 'addLiquidity' : 'removeLiquidity',
    orderId: normalizedOrderId,
    cancelSecret: normalizedCancelSecret,
    quote,
    creationTimeUpperBound,
    built: await buildUserActionTx({
      wallet,
      contractAddress: options.pool,
      circuitId: 'liquidityOrder',
      cancelSecret: normalizedCancelSecret,
      environment,
      compiledDir,
      compiledModule,
      args: (moduleToUse): CircuitArgs<'liquidityOrder'> => [
        bytes32FromHex(normalizedOrderId, 'order_id'),
        contractDirection(moduleToUse, fields.direction),
        fields.amountIn,
        fields.amountAux,
        fields.minAmountOut,
        bytes32FromHex(parties.recipient, 'recipient'),
        bytes32FromHex(parties.owner, 'owner'),
        BigInt(quote.deadline),
        BigInt(creationTimeUpperBound),
      ],
    }),
  };
};

const buildCancelTx = async (
  kind: 'cancelSwap' | 'cancelLiquidity',
  {
    wallet,
    environment,
    compiledDir,
    compiledModule = null,
    pool,
    orderId,
    cancelSecret,
  }: CancelOrderOptions & BuilderConfig & { wallet: NorthStarWallet },
): Promise<BuiltOrderTx> => {
  const circuitId = kind === 'cancelSwap' ? 'cancelOrder' : 'cancelLiquidityOrder';
  poolAddress(pool);
  const normalizedOrderId = nonzeroBytes32Hex(orderId, 'order_id');
  const normalizedCancelSecret = resolveCancelSecret(wallet, pool, normalizedOrderId, cancelSecret);
  return {
    kind,
    orderId: normalizedOrderId,
    cancelSecret: normalizedCancelSecret,
    quote: null,
    built: await buildUserActionTx({
      wallet,
      contractAddress: pool,
      circuitId,
      cancelSecret: normalizedCancelSecret,
      environment,
      compiledDir,
      compiledModule,
      args: (): CircuitArgs<typeof circuitId> => [bytes32FromHex(normalizedOrderId, 'order_id')],
    }),
  };
};

export const buildCancelOrderTx = (
  options: CancelOrderOptions & BuilderConfig & { wallet: NorthStarWallet },
) => buildCancelTx('cancelSwap', options);

export const buildCancelLiquidityOrderTx = (
  options: CancelOrderOptions & BuilderConfig & { wallet: NorthStarWallet },
) => buildCancelTx('cancelLiquidity', options);

/** Settles a mature liquidity order at its original terms. Anyone can call it. */
export const buildPublicLiquiditySettlementTx = async ({
  pool,
  orderId,
  ...config
}: BuilderConfig & { wallet: NorthStarWallet; pool: string; orderId: string }): Promise<BuiltOrderTx> => {
  const address = poolAddress(pool);
  const normalizedOrderId = nonzeroBytes32Hex(orderId, 'order_id');
  return {
    kind: 'settleLiquidity',
    orderId: normalizedOrderId,
    cancelSecret: null,
    quote: null,
    built: await buildUserActionTx({
      ...config,
      contractAddress: address,
      circuitId: 'settleLiquidityOrder',
      args: (): CircuitArgs<'settleLiquidityOrder'> => [bytes32FromHex(normalizedOrderId, 'order_id')],
    }),
  };
};
