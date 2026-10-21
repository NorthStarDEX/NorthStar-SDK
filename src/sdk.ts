import {
  reconcileDelayedSubmission,
  resolveDelayedSubmission,
  withDelayedSubmission,
} from './internal/delayed-submission.js';
import {
  assertCheckpoint,
  providerEnvironment,
  type Environment,
  type Providers,
} from './internal/environment.js';
import { assertAuditedArtifacts } from './internal/artifacts.js';
import { normalizeBytes32Hex } from './internal/common.js';
import type { SeedInput, WalletCheckpoint } from './internal/types.js';
import {
  completeAcceptedSubmission,
  type NorthStarAcceptedSubmission,
} from './internal/submission-recovery.js';
import {
  DEFAULT_PROVING_SERVER_URL,
  DEFAULT_TX_TTL_SECONDS,
  balanceProvenTransaction,
  openWalletRuntime,
  proveUnprovenTransaction,
  serializeRuntimeCheckpoint,
  stopWalletRuntime,
  submitFinalized,
  transactionFee,
  waitForWalletSync,
  type SyncProgress,
} from './runtime.js';
import {
  buildCancelLiquidityOrderTx,
  buildCancelOrderTx,
  buildDepositOrderTx,
  buildLiquidityOrderTx,
  buildPublicLiquiditySettlementTx,
  getOrder,
  getPool,
  getPoolPrice,
  quoteLiquidity,
  quoteSwap,
  type BuiltOrderTx,
  type CancelOrderOptions,
  type LiquidityOrderOptions,
  type LiquidityQuote,
  type LiquidityQuoteOptions,
  type OrderKind,
  type PoolInfo,
  type PoolOrder,
  type PoolPrice,
  type SwapOrderOptions,
  type SwapQuote,
  type SwapQuoteOptions,
} from './transaction-builder.js';
import { buildCreatePoolTx, buildFundPoolTx, type CreatePoolOptions, type FundPoolOptions } from './pool.js';
import { walletFromSeed, type NorthStarSeedWallet } from './wallet.js';

type RuntimeHandle = Awaited<ReturnType<typeof openWalletRuntime>>;
// How long a wallet may take to catch up before sync() or prove() gives up.
const WALLET_SYNC_TIMEOUT_MS = 3_600_000;
type BalancedTransaction = Awaited<ReturnType<typeof balanceProvenTransaction>>;

export type NorthStarSdkConfig = {
  /** Node and indexer endpoints, for example `(await startProviderRelay({ projectId })).providers`. */
  providers: Providers;
  /** Wallet seed, hex, 32 bytes or more. Needed to build orders; reads and quotes work without it. */
  seed?: SeedInput | null;
  /**
   * Saved wallet state from `sdk.sync()` or a submit. Without it the first
   * wallet use syncs from the start, which can take a long time.
   */
  checkpoint?: WalletCheckpoint | null;
  account?: number;
  keyIndex?: number;
  /** Proof server URL. Default `http://127.0.0.1:6300`. */
  provingServerUrl?: string;
  /** Lifetime of a balanced transaction, in seconds. Default 3600. */
  txTtlSeconds?: number;
  /**
   * Folder for the liquidity submission journal. Off by default. When set, a
   * liquidity order is saved there before it is sent, so an unknown result is
   * never resent.
   */
  journalDir?: string | null;
};

export type SyncOptions = {
  /** Give up after this many milliseconds. Default one hour. */
  timeoutMs?: number;
  /** Called every few seconds while the wallet syncs. */
  onProgress?: (progress: SyncProgress) => void;
};

export type WalletBalances = {
  /** Unshielded tokens by token type, in base units. NIGHT is `00…00`. */
  unshielded: Record<string, string>;
  /** DUST for fees, in SPECK (10^15 SPECK = 1 DUST). */
  dust: string;
};

export type SubmitOptions = {
  /** Wait until the transaction is `Submitted`, `InBlock` or `Finalized` (default). */
  waitForStatus?: 'Submitted' | 'InBlock' | 'Finalized';
};

export type NorthStarSubmittedOrder = NorthStarAcceptedSubmission & {
  /** The wallet state after this transaction. Save it and pass it as `checkpoint` next time. */
  checkpoint: WalletCheckpoint;
};

type WalletMaterial = {
  account: number;
  keyIndex: number;
  unshieldedAddress: string;
  unshieldedAddressHex: string;
};

type OrderContext = {
  order: BuiltOrderTx;
  runtime: RuntimeHandle;
  walletMaterial: WalletMaterial;
  checkpoint: WalletCheckpoint | null;
  environment: Environment;
  journalDir: string | null;
  txTtlSeconds: number;
  saveCheckpoint: (checkpoint: WalletCheckpoint) => void;
  stop: () => Promise<void>;
};

// Preserve the workflow error if stopping the wallet also fails.
const stopAfterFailure = async (context: OrderContext): Promise<void> => {
  await context.stop().catch(() => undefined);
};

type SyncedState = {
  unshielded?: { balances?: Record<string, bigint> };
  dust?: { balance?: (time: Date) => bigint };
};

const walletBalances = (state: unknown): WalletBalances => {
  const synced = state as SyncedState | null | undefined;
  const balances = synced?.unshielded?.balances;
  const dust = synced?.dust?.balance?.(new Date());
  if (balances == null || typeof dust !== 'bigint') throw new Error('wallet_balances_unavailable');
  return {
    unshielded: Object.fromEntries(
      Object.entries(balances).map(([token, amount]) => [token, String(amount)]),
    ),
    dust: String(dust),
  };
};

/** An order built and checked against the pool, ready to prove. */
export class NorthStarBuiltOrder {
  readonly kind: OrderKind;
  readonly pool: string;
  /** The order's ID; null for createPool and fundPool. */
  readonly orderId: string | null;
  /** The order's terms as quoted when it was built; null for cancels and pool setup. */
  readonly quote: SwapQuote | LiquidityQuote | null;
  readonly #order: BuiltOrderTx;
  readonly #open: () => Promise<OrderContext>;

  constructor(order: BuiltOrderTx, open: () => Promise<OrderContext>) {
    this.#order = order;
    this.#open = open;
    this.kind = order.kind;
    this.pool = order.built.contractAddress;
    this.orderId = order.orderId;
    this.quote = order.quote;
  }

  /**
   * The order's cancel secret. By default it is derived from your seed, so the
   * seed alone can cancel the order. If you passed your own secret, store it:
   * the SDK never saves secrets, and they are left out of toJSON(), logs and
   * submit results.
   */
  get cancelSecret(): string | null {
    return this.#order.cancelSecret;
  }

  /** The pool creator secret (createPool and fundPool). Same rules as cancelSecret. */
  get creatorSecret(): string | null {
    return this.#order.creatorSecret ?? null;
  }

  /** Opens the wallet and proves the transaction. Call `close()` on the result if you do not submit. */
  async prove(): Promise<NorthStarProvenOrder> {
    const context = await this.#open();
    try {
      const provenTx = await proveUnprovenTransaction({
        facade: context.runtime.facade,
        unprovenTx: this.#order.built.unprovenTx,
      });
      return new NorthStarProvenOrder(context, provenTx);
    } catch (error) {
      await stopAfterFailure(context);
      throw error;
    }
  }

  /** Proves, balances and submits in one step. */
  async submit(options: SubmitOptions = {}): Promise<NorthStarSubmittedOrder> {
    const proven = await this.prove();
    const balanced = await proven.balance();
    return await balanced.submit(options);
  }

  toJSON() {
    return { kind: this.kind, pool: this.pool, orderId: this.orderId, quote: this.quote };
  }
}

export class NorthStarProvenOrder {
  readonly #context: OrderContext;
  readonly #provenTx: unknown;

  constructor(context: OrderContext, provenTx: unknown) {
    this.#context = context;
    this.#provenTx = provenTx;
  }

  /** Adds the wallet's inputs and the DUST fee, and signs. */
  async balance(): Promise<NorthStarBalancedOrder> {
    const { runtime } = this.#context;
    try {
      const finalized = await balanceProvenTransaction({
        facade: runtime.facade,
        provenTx: this.#provenTx,
        shieldedSecretKeys: runtime.shieldedSecretKeys,
        dustSecretKey: runtime.dustSecretKey,
        unshieldedKeyStore: runtime.unshieldedKeyStore,
        txTtlSeconds: this.#context.txTtlSeconds,
      });
      const fee = await transactionFee({ facade: runtime.facade, finalized });
      return new NorthStarBalancedOrder(this.#context, finalized, fee);
    } catch (error) {
      await stopAfterFailure(this.#context);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.#context.stop();
  }
}

export class NorthStarBalancedOrder {
  /** The fee this transaction pays, in SPECK (10^15 SPECK = 1 DUST). */
  readonly fee: bigint;
  readonly #context: OrderContext;
  readonly #finalized: BalancedTransaction;

  constructor(context: OrderContext, finalized: BalancedTransaction, fee: bigint) {
    this.#context = context;
    this.#finalized = finalized;
    this.fee = fee;
  }

  async submit({ waitForStatus = 'Finalized' }: SubmitOptions = {}): Promise<NorthStarSubmittedOrder> {
    const context = this.#context;
    let submission: { txHash?: unknown; blockHash?: unknown; blockHeight?: unknown };
    try {
      submission = await withDelayedSubmission({
        order: context.order,
        environment: context.environment,
        journalDir: context.journalDir,
        walletScope: context.walletMaterial.unshieldedAddressHex,
        tx: this.#finalized as never,
        submit: () =>
          submitFinalized({ facade: context.runtime.facade, finalized: this.#finalized, waitForStatus }),
      });
    } catch (error) {
      await stopAfterFailure(context);
      throw error;
    }
    const accepted: NorthStarAcceptedSubmission = {
      txId: String(submission.txHash),
      blockHash: submission.blockHash == null ? null : String(submission.blockHash),
      blockHeight: submission.blockHeight == null ? null : Number(submission.blockHeight),
    };
    const { checkpoint } = await completeAcceptedSubmission(
      accepted,
      async () => {
        const saved = await serializeRuntimeCheckpoint({
          checkpoint: context.checkpoint,
          wallet: context.walletMaterial,
          facade: context.runtime.facade,
          txHistoryStorage: context.runtime.txHistoryStorage,
        });
        context.saveCheckpoint(saved);
        return saved;
      },
      context.stop,
    );
    return { ...accepted, checkpoint };
  }

  async close(): Promise<void> {
    await this.#context.stop();
  }
}

export class NorthStarSDK {
  readonly account: number;
  readonly keyIndex: number;
  readonly provingServerUrl: string;
  readonly txTtlSeconds: number;
  readonly #seed: SeedInput | null;
  readonly #environment: Environment;
  readonly #journalDir: string | null;
  #checkpoint: WalletCheckpoint | null;
  #busy = false;

  constructor({
    providers,
    seed = null,
    checkpoint = null,
    account = checkpoint?.account ?? 0,
    keyIndex = checkpoint?.keyIndex ?? 0,
    provingServerUrl = DEFAULT_PROVING_SERVER_URL,
    txTtlSeconds = DEFAULT_TX_TTL_SECONDS,
    journalDir = null,
  }: NorthStarSdkConfig) {
    this.#environment = providerEnvironment(providers);
    assertCheckpoint(checkpoint, this.#environment);
    this.#seed = seed;
    this.#checkpoint = checkpoint;
    this.account = account;
    this.keyIndex = keyIndex;
    this.provingServerUrl = provingServerUrl;
    this.txTtlSeconds = txTtlSeconds;
    this.#journalDir = journalDir;
  }

  /** The latest wallet checkpoint: from the constructor, `sync()` or the last submit. Save it. */
  get checkpoint(): WalletCheckpoint | null {
    return this.#checkpoint;
  }

  setCheckpoint(checkpoint: WalletCheckpoint | null): void {
    assertCheckpoint(checkpoint, this.#environment);
    this.#checkpoint = checkpoint;
  }

  /** Send tokens to `unshielded`. Fees are paid in DUST: register NIGHT for DUST to `dust`. */
  addresses(): { unshielded: string; dust: string } {
    const wallet = this.#wallet();
    try {
      return { unshielded: wallet.unshieldedAddress, dust: wallet.dustAddress };
    } finally {
      wallet.close();
    }
  }

  /**
   * Syncs the wallet and returns a checkpoint to save; pass it as `checkpoint`
   * next time to skip the full sync. It holds no keys, but it shows the
   * wallet's balances and history, so keep it private. It stays valid only
   * with the same providers.
   */
  async sync(options: SyncOptions = {}): Promise<WalletCheckpoint> {
    return (await this.#syncWallet(options, () => null)).checkpoint;
  }

  /** Syncs the wallet and returns its balances. Like `sync()`, it also updates `sdk.checkpoint`. */
  async balances(options: SyncOptions = {}): Promise<WalletBalances> {
    return (await this.#syncWallet(options, walletBalances)).value;
  }

  async getPrice(pool: string): Promise<PoolPrice> {
    return await getPoolPrice({ environment: this.#environment, pool });
  }

  /** Reserves, fees, LP token and the bond every order locks. */
  async getPool(pool: string): Promise<PoolInfo> {
    return await getPool({ environment: this.#environment, pool });
  }

  /** An open order, or null once it has settled, been cancelled or never existed. */
  async getOrder(pool: string, orderId: string): Promise<PoolOrder | null> {
    return await getOrder({ environment: this.#environment, pool, orderId });
  }

  /** The terms `buildSwapOrder` would use with the same options. */
  async quoteSwapOrder(options: SwapQuoteOptions): Promise<SwapQuote> {
    return await quoteSwap({ ...options, environment: this.#environment });
  }

  /** The terms `buildLiquidityOrder` would use with the same options. */
  async quoteLiquidityOrder(options: LiquidityQuoteOptions): Promise<LiquidityQuote> {
    return await quoteLiquidity({ ...options, environment: this.#environment });
  }

  async buildSwapOrder(options: SwapOrderOptions): Promise<NorthStarBuiltOrder> {
    return await this.#build((wallet) =>
      buildDepositOrderTx({ ...options, wallet, environment: this.#environment }),
    );
  }

  async buildLiquidityOrder(options: LiquidityOrderOptions): Promise<NorthStarBuiltOrder> {
    return await this.#build((wallet) =>
      buildLiquidityOrderTx({ ...options, wallet, environment: this.#environment }),
    );
  }

  async buildCancelOrder(options: CancelOrderOptions): Promise<NorthStarBuiltOrder> {
    return await this.#build((wallet) =>
      buildCancelOrderTx({ ...options, wallet, environment: this.#environment }),
    );
  }

  async buildCancelLiquidityOrder(options: CancelOrderOptions): Promise<NorthStarBuiltOrder> {
    return await this.#build((wallet) =>
      buildCancelLiquidityOrderTx({ ...options, wallet, environment: this.#environment }),
    );
  }

  /** Settles a liquidity order that NorthStar has not settled within 30 days. Anyone can do this. */
  async buildPublicLiquiditySettlement(options: {
    pool: string;
    orderId: string;
  }): Promise<NorthStarBuiltOrder> {
    return await this.#build((wallet) =>
      buildPublicLiquiditySettlementTx({
        pool: options.pool,
        orderId: options.orderId,
        wallet,
        environment: this.#environment,
      }),
    );
  }

  /** Deploys a new pool. Its maintenance committee is always empty (threshold 1). */
  async createPool(options: CreatePoolOptions): Promise<NorthStarBuiltOrder> {
    return await this.#build((wallet) =>
      buildCreatePoolTx({ ...options, wallet, txTtlSeconds: this.txTtlSeconds }),
    );
  }

  /** Makes the creator's one-time first deposit into an empty pool; it sets the opening price. */
  async fundPool(options: FundPoolOptions): Promise<NorthStarBuiltOrder> {
    return await this.#build((wallet) =>
      buildFundPoolTx({ ...options, wallet, environment: this.#environment }),
    );
  }

  /** Checks a liquidity submission saved in `journalDir` against the chain. Never resends it. */
  async reconcileSubmission(file: string) {
    return await reconcileDelayedSubmission(file, this.#environment);
  }

  /** Archives a journaled liquidity submission once the chain shows its final result. */
  async resolveSubmission(file: string) {
    return await resolveDelayedSubmission(file, this.#environment);
  }

  // Reads the synced state before the wallet stops.
  async #syncWallet<T>(
    { timeoutMs = WALLET_SYNC_TIMEOUT_MS, onProgress }: SyncOptions,
    read: (state: unknown) => T,
  ) {
    const { runtime, walletMaterial, stop } = await this.#openRuntime();
    let checkpoint: WalletCheckpoint;
    let value: T;
    try {
      await runtime.facade.start(runtime.shieldedSecretKeys, runtime.dustSecretKey);
      value = read(await waitForWalletSync(runtime.facade, { timeoutMs, onProgress }));
      checkpoint = await serializeRuntimeCheckpoint({
        checkpoint: this.#checkpoint,
        wallet: walletMaterial,
        facade: runtime.facade,
        txHistoryStorage: runtime.txHistoryStorage,
      });
    } catch (error) {
      await stop().catch(() => undefined);
      throw error;
    }
    await stop();
    this.setCheckpoint(checkpoint);
    return { checkpoint, value };
  }

  #requireSeed(): SeedInput {
    if (this.#seed == null) throw new Error('seed_required');
    return this.#seed;
  }

  // Derives the wallet and checks that the checkpoint belongs to it. Close it after use.
  #wallet(): NorthStarSeedWallet {
    const wallet = walletFromSeed({
      seed: this.#requireSeed(),
      account: this.account,
      keyIndex: this.keyIndex,
    });
    const saved = this.#checkpoint?.unshieldedAddressHex;
    let error: Error | null = null;
    if (this.#checkpoint != null && saved == null) error = new Error('checkpoint_address_required');
    else if (
      saved != null &&
      normalizeBytes32Hex(String(saved), 'checkpoint_address') !== wallet.unshieldedAddressHex
    )
      error = new Error('checkpoint_address_mismatch');
    if (error != null) {
      wallet.close();
      throw error;
    }
    return wallet;
  }

  async #build(build: (wallet: NorthStarSeedWallet) => Promise<BuiltOrderTx>): Promise<NorthStarBuiltOrder> {
    const wallet = this.#wallet();
    let order: BuiltOrderTx;
    try {
      order = await build(wallet);
    } finally {
      wallet.close();
    }
    return new NorthStarBuiltOrder(order, () => this.#openOrderContext(order));
  }

  // One wallet runtime at a time: two would spend the same coins.
  async #openRuntime(compiledDir?: string, provingServerUrl?: string) {
    const wallet = this.#wallet();
    const walletMaterial: WalletMaterial = {
      account: this.account,
      keyIndex: this.keyIndex,
      unshieldedAddress: wallet.unshieldedAddress,
      unshieldedAddressHex: wallet.unshieldedAddressHex,
    };
    wallet.close();
    if (this.#busy) throw new Error('wallet_busy:submit_or_close_the_open_order_first');
    this.#busy = true;
    try {
      const runtime = await openWalletRuntime({
        wallet: { ...walletMaterial, seed: this.#requireSeed() },
        checkpoint: this.#checkpoint,
        environment: this.#environment,
        provingServerUrl,
        compiledDir,
      });
      const stop = async () => {
        try {
          await stopWalletRuntime(runtime);
        } finally {
          this.#busy = false;
        }
      };
      return { runtime, walletMaterial, stop };
    } catch (error) {
      this.#busy = false;
      throw error;
    }
  }

  async #openOrderContext(order: BuiltOrderTx): Promise<OrderContext> {
    const release = assertAuditedArtifacts(order.built.compiledDir);
    if (release.releaseId !== order.built.releaseId || release.sourceSha256 !== order.built.sourceSha256) {
      throw new Error('amm_built_order_release_mismatch');
    }
    const checkpoint = this.#checkpoint;
    const { runtime, walletMaterial, stop } = await this.#openRuntime(
      order.built.compiledDir,
      this.provingServerUrl,
    );
    try {
      await runtime.facade.start(runtime.shieldedSecretKeys, runtime.dustSecretKey);
      await waitForWalletSync(runtime.facade, { timeoutMs: WALLET_SYNC_TIMEOUT_MS });
    } catch (error) {
      await stop().catch(() => undefined);
      throw error;
    }
    return {
      order,
      runtime,
      walletMaterial,
      checkpoint,
      environment: this.#environment,
      journalDir: this.#journalDir,
      txTtlSeconds: this.txTtlSeconds,
      saveCheckpoint: (saved) => this.setCheckpoint(saved),
      stop,
    };
  }
}

export const northstarsdk = (config: NorthStarSdkConfig) => new NorthStarSDK(config);
