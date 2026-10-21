import { DustSecretKey, LedgerParameters, ZswapSecretKeys } from '@midnight-ntwrk/ledger-v8';
import { InMemoryTransactionHistoryStorage } from '@midnight-ntwrk/wallet-sdk-abstractions';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { WalletEntrySchema, WalletFacade, mergeWalletEntries } from '@midnight-ntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { PublicKey, UnshieldedWallet, createKeystore } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { u8aToHex } from '@polkadot/util';

import { deriveWalletSecrets, normalizeSeedHex } from './internal/wallet-secrets.js';
import {
  assertNetworkEnvironment,
  assertMainnetBlock,
  type Environment,
  assertCheckpoint,
  checkpointBinding,
  redactProviderError,
} from './internal/environment.js';
import { createAmmProvingService } from './internal/proof-provider.js';
import { lastWalletReconnect, quietWalletLogs } from './internal/quiet-logs.js';
import type { UnknownRecord, WalletCheckpoint } from './internal/types.js';

/** A proof server run locally with `midnightntwrk/proof-server`. */
export const DEFAULT_PROVING_SERVER_URL = 'http://127.0.0.1:6300';
export const DEFAULT_TX_TTL_SECONDS = 3600;
const FEE_BLOCKS_MARGIN = 3;
const SYNC_BATCH = { size: 1000, timeout: 50, spacing: 0 };

type WaitForStatus = 'Submitted' | 'InBlock' | 'Finalized' | string;

type WalletRuntimeMaterial = {
  seed: string | Uint8Array;
  account?: number;
  keyIndex?: number;
  unshieldedAddress?: string;
  unshieldedAddressHex?: string;
};

type TransactionLike = {
  serialize?: () => Uint8Array | Buffer | string;
  identifiers?: () => unknown[];
  transactionHash?: () => unknown;
};

type FacadeLike = {
  start: (...args: unknown[]) => Promise<unknown>;
  stop: () => Promise<unknown>;
  waitForSyncedState: () => Promise<unknown>;
  state?: () => { subscribe: (observer: { next: (state: unknown) => void }) => { unsubscribe: () => void } };
  provingService: { prove: (tx: unknown) => Promise<unknown> };
  balanceUnboundTransaction: (...args: unknown[]) => Promise<unknown>;
  balanceFinalizedTransaction: (...args: unknown[]) => Promise<unknown>;
  signRecipe: (recipe: unknown, sign: (data: Uint8Array) => unknown) => Promise<unknown>;
  finalizeRecipe: (recipe: unknown) => Promise<TransactionLike>;
  calculateTransactionFee: (tx: unknown) => Promise<unknown>;
  submissionService: {
    submitTransaction: (tx: unknown, waitForStatus: WaitForStatus) => Promise<UnknownRecord>;
  };
  pendingTransactionsService?: { addPendingTransaction?: (tx: unknown) => Promise<unknown> };
  shielded: { serializeState: () => Promise<unknown> };
  unshielded: { serializeState: () => Promise<unknown> };
  dust: { serializeState: () => Promise<unknown> };
};

const runtimeEnvironments = new WeakMap<FacadeLike, Environment>();
const ammProvingServices = new WeakMap<FacadeLike, ReturnType<typeof createAmmProvingService>>();

type UnshieldedKeyStoreLike = {
  getPublicKey: () => unknown;
  signData: (data: Uint8Array) => unknown;
};

type RuntimeHandle = {
  facade: FacadeLike;
  shieldedSecretKeys: unknown;
  dustSecretKey: unknown;
  unshieldedKeyStore: UnshieldedKeyStoreLike;
  txHistoryStorage: { serialize: () => Promise<unknown> };
  clear: () => void;
};

const fetchDustParameters = async (environment: Environment) => {
  const response = await fetch(environment.indexer, {
    method: 'POST',
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: 'query NorthStarDustParameters { block { height hash protocolVersion ledgerParameters } }',
    }),
  });
  if (!response.ok) throw new Error(`indexer_dust_parameters_failed:${response.status}`);
  const body = (await response.json()) as {
    errors?: Array<{ message?: string }>;
    data?: { block?: UnknownRecord };
  };
  if (body.errors?.length)
    throw new Error(`indexer_dust_parameters_failed:${body.errors[0]?.message ?? 'unknown'}`);
  await assertMainnetBlock(environment, body.data?.block);
  const ledgerParameters = body.data?.block?.ledgerParameters;
  if (ledgerParameters == null) throw new Error('indexer_dust_parameters_missing');
  return LedgerParameters.deserialize(Buffer.from(String(ledgerParameters), 'hex')).dust;
};

const historyStorageFromCheckpoint = (checkpoint: WalletCheckpoint | null | undefined) =>
  checkpoint?.txHistory == null
    ? new InMemoryTransactionHistoryStorage(WalletEntrySchema, mergeWalletEntries)
    : InMemoryTransactionHistoryStorage.restore(
        checkpoint.txHistory as string,
        WalletEntrySchema,
        mergeWalletEntries,
      );

// Without a proof server URL the runtime can sync but not prove.
const openWalletRuntimeUnchecked = async ({
  wallet,
  checkpoint,
  environment,
  provingServerUrl,
  compiledDir,
}: {
  wallet: WalletRuntimeMaterial;
  checkpoint?: WalletCheckpoint | null;
  environment: Environment;
  provingServerUrl?: string | null;
  compiledDir?: string;
}): Promise<RuntimeHandle> => {
  const provingService = provingServerUrl ? createAmmProvingService(provingServerUrl, compiledDir) : null;
  const seed = normalizeSeedHex(wallet.seed);
  assertCheckpoint(checkpoint, environment);
  await assertNetworkEnvironment(environment);
  quietWalletLogs(environment.nodeWS);
  if (checkpoint != null && !checkpoint.unshieldedAddressHex) throw new Error('checkpoint_address_required');
  const secrets = deriveWalletSecrets({ seed, account: wallet.account ?? 0, keyIndex: wallet.keyIndex ?? 0 });
  const shieldedSecretKeys = ZswapSecretKeys.fromSeed(secrets.shielded);
  const dustSecretKey = DustSecretKey.fromSeed(secrets.dust);
  const unshieldedKeyStore = createKeystore(secrets.unshielded, environment.walletNetworkId);
  const txHistoryStorage = historyStorageFromCheckpoint(checkpoint);

  const configuration = {
    networkId: environment.walletNetworkId,
    relayURL: new URL(environment.nodeWS),
    indexerClientConnection: {
      indexerHttpUrl: environment.indexer,
      indexerWsUrl: environment.indexerWS,
    },
    txHistoryStorage,
    costParameters: { feeBlocksMargin: FEE_BLOCKS_MARGIN, additionalFeeOverhead: 0n },
    batchUpdates: SYNC_BATCH,
    ...(provingServerUrl ? { provingServerUrl: new URL(provingServerUrl) } : {}),
  };

  const shielded = checkpoint?.shieldedState
    ? ShieldedWallet(configuration).restore(checkpoint.shieldedState as string)
    : ShieldedWallet(configuration).startWithSecretKeys(shieldedSecretKeys);
  const unshielded = checkpoint?.unshieldedState
    ? UnshieldedWallet(configuration).restore(checkpoint.unshieldedState as string)
    : UnshieldedWallet(configuration).startWithPublicKey(PublicKey.fromKeyStore(unshieldedKeyStore));
  const dust = checkpoint?.dustState
    ? DustWallet(configuration).restore(checkpoint.dustState as string)
    : DustWallet(configuration).startWithSecretKey(dustSecretKey, await fetchDustParameters(environment));

  const facade = (await WalletFacade.init({
    configuration,
    shielded: () => shielded,
    unshielded: () => unshielded,
    dust: () => dust,
    ...(provingServerUrl
      ? {}
      : {
          provingService: () => ({
            prove: async () => {
              throw new Error('proof_server_required');
            },
          }),
        }),
  })) as unknown as FacadeLike;

  if (provingService != null) ammProvingServices.set(facade, provingService);
  runtimeEnvironments.set(facade, environment);

  const clear = () => {
    ammProvingServices.delete(facade);
    runtimeEnvironments.delete(facade);
    shieldedSecretKeys.clear?.();
    dustSecretKey.clear?.();
    for (const value of Object.values(secrets) as Uint8Array[]) value.fill(0);
  };

  return {
    facade,
    shieldedSecretKeys,
    dustSecretKey,
    unshieldedKeyStore: unshieldedKeyStore as UnshieldedKeyStoreLike,
    txHistoryStorage,
    clear,
  };
};

export const openWalletRuntime = async (
  options: Parameters<typeof openWalletRuntimeUnchecked>[0],
): Promise<RuntimeHandle> => {
  try {
    return await openWalletRuntimeUnchecked(options);
  } catch (error) {
    throw redactProviderError(error);
  }
};

/** Sync progress in percent for each part of the wallet. */
export type SyncProgress = {
  synced: boolean;
  shielded: number;
  unshielded: number;
  dust: number;
};

// Shielded and DUST progress count ledger indexes, unshielded counts indexer
// transaction IDs; both report how far the wallet has applied its history.
const sectionPercent = (state: unknown, name: string): number => {
  const section = (state as UnknownRecord | undefined)?.[name] as UnknownRecord | undefined;
  const progress = (section?.progress ?? (section?.state as UnknownRecord | undefined)?.progress) as
    | UnknownRecord
    | undefined;
  if (progress == null) return 0;
  const complete =
    typeof progress.isStrictlyComplete === 'function'
      ? (progress.isStrictlyComplete as () => boolean).call(progress)
      : progress.isStrictlyComplete;
  if (complete) return 100;
  const applied = progress.appliedIndex ?? progress.appliedId;
  const target = progress.highestRelevantWalletIndex ?? progress.highestTransactionId;
  if (applied == null || target == null || BigInt(String(target)) === 0n) return 0;
  return Math.min(100, Number((BigInt(String(applied)) * 10_000n) / BigInt(String(target))) / 100);
};

export const waitForWalletSync = async (
  facade: FacadeLike,
  {
    timeoutMs,
    onProgress,
    progressIntervalMs = 5_000,
  }: { timeoutMs: number; onProgress?: (progress: SyncProgress) => void; progressIntervalMs?: number },
): Promise<unknown> => {
  let lastReport = 0;
  const subscription =
    onProgress == null
      ? null
      : facade.state?.().subscribe({
          next: (state) => {
            if (Date.now() - lastReport < progressIntervalMs) return;
            lastReport = Date.now();
            onProgress({
              synced: Boolean((state as UnknownRecord | undefined)?.isSynced),
              shielded: sectionPercent(state, 'shielded'),
              unshielded: sectionPercent(state, 'unshielded'),
              dust: sectionPercent(state, 'dust'),
            });
          },
        });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const state = await Promise.race([
      facade.waitForSyncedState(),
      new Promise((_resolve, reject) => {
        timer = setTimeout(() => {
          const reason = lastWalletReconnect();
          reject(new Error(`wallet_sync_timeout:${timeoutMs}${reason ? `:${reason}` : ''}`));
        }, timeoutMs);
      }),
    ]);
    onProgress?.({ synced: true, shielded: 100, unshielded: 100, dust: 100 });
    return state;
  } finally {
    clearTimeout(timer);
    subscription?.unsubscribe();
  }
};

export const stopWalletRuntime = async (runtime: RuntimeHandle): Promise<void> => {
  try {
    await runtime.facade.stop();
  } finally {
    runtime.clear();
  }
};

/** The transaction fee in SPECK (10^15 SPECK = 1 DUST). */
export const transactionFee = async ({
  facade,
  finalized,
}: {
  facade: FacadeLike;
  finalized: TransactionLike;
}): Promise<bigint> => BigInt(String(await facade.calculateTransactionFee(finalized)));

const signRecipe = async ({
  facade,
  recipe,
  unshieldedKeyStore,
}: {
  facade: FacadeLike;
  recipe: unknown;
  unshieldedKeyStore: UnshieldedKeyStoreLike;
}) => await facade.signRecipe(recipe, (data: Uint8Array) => unshieldedKeyStore.signData(data));

export const proveUnprovenTransaction = async ({
  facade,
  unprovenTx,
}: {
  facade: FacadeLike;
  unprovenTx: unknown;
}) => {
  const service = ammProvingServices.get(facade);
  if (service != null) return await service.prove(unprovenTx as Parameters<typeof service.prove>[0]);
  return await facade.provingService.prove(unprovenTx);
};

const balanceAndFinalizeStaged = async ({
  facade,
  provenTx,
  shieldedSecretKeys,
  dustSecretKey,
  unshieldedKeyStore,
  ttl,
}: {
  facade: FacadeLike;
  provenTx: unknown;
  shieldedSecretKeys: unknown;
  dustSecretKey: unknown;
  unshieldedKeyStore: UnshieldedKeyStoreLike;
  ttl: Date;
}) => {
  const actorRecipe = await facade.balanceUnboundTransaction(
    provenTx,
    { shieldedSecretKeys, dustSecretKey },
    { ttl, tokenKindsToBalance: ['shielded', 'unshielded'] },
  );
  const signedActorRecipe = await signRecipe({ facade, recipe: actorRecipe, unshieldedKeyStore });
  const actorFinalized = await facade.finalizeRecipe(signedActorRecipe);
  // The wallet otherwise adds an empty DUST action even when fees are zero.
  // Require an exact zero fee and zero imbalance in every segment before omitting it.
  const estimatedFee = await facade.calculateTransactionFee(actorFinalized);
  const transaction = actorFinalized as TransactionLike & {
    imbalances?: (segment: number, fees: bigint) => Map<unknown, bigint>;
    intents?: Map<number, unknown>;
  };
  if (estimatedFee === 0n && typeof transaction.imbalances === 'function') {
    const segments = new Set([0, ...(transaction.intents?.keys() ?? [])]);
    if (
      [...segments].every((segment) =>
        [...transaction.imbalances!(segment, 0n).values()].every((value) => value === 0n),
      )
    ) {
      return actorFinalized;
    }
  }
  const dustRecipe = await facade.balanceFinalizedTransaction(
    actorFinalized,
    { shieldedSecretKeys, dustSecretKey },
    { ttl, tokenKindsToBalance: ['dust'] },
  );
  const signedDustRecipe = await signRecipe({ facade, recipe: dustRecipe, unshieldedKeyStore });
  return await facade.finalizeRecipe(signedDustRecipe);
};

export const balanceProvenTransaction = async ({
  facade,
  provenTx,
  shieldedSecretKeys,
  dustSecretKey,
  unshieldedKeyStore,
  txTtlSeconds = DEFAULT_TX_TTL_SECONDS,
}: {
  facade: FacadeLike;
  provenTx: unknown;
  shieldedSecretKeys: unknown;
  dustSecretKey: unknown;
  unshieldedKeyStore: UnshieldedKeyStoreLike;
  txTtlSeconds?: number;
}) =>
  await balanceAndFinalizeStaged({
    facade,
    provenTx,
    shieldedSecretKeys,
    dustSecretKey,
    unshieldedKeyStore,
    ttl: new Date(Date.now() + txTtlSeconds * 1000),
  });

/** The transaction's hash as explorers and indexers show it (not the node's extrinsic hash). */
export const transactionHashOf = (finalized: TransactionLike): string => {
  let hash: unknown = null;
  try {
    hash = finalized.transactionHash?.();
  } catch {
    // The ledger has a hash only for proven, signed and bound transactions.
  }
  if (typeof hash !== 'string' || !/^[0-9a-f]{64}$/u.test(hash))
    throw new Error('transaction_hash_unavailable');
  return hash;
};

/**
 * Reads (getPool, getOrder, the order builders) come from the indexer, which can
 * trail the node by a block or two. Returns once the indexer lists the
 * transaction, or false after `timeoutMs`; the transaction is final either way.
 */
export const waitForIndexedTransaction = async (
  indexer: string,
  txHash: string,
  { timeoutMs = 60_000, pollMs = 1_000 }: { timeoutMs?: number; pollMs?: number } = {},
): Promise<boolean> => {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      const response = await fetch(indexer, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: `{ transactions(offset: { hash: "${txHash}" }) { hash } }` }),
        signal: AbortSignal.timeout(10_000),
      });
      const body = (await response.json()) as { data?: { transactions?: unknown[] } };
      if ((body.data?.transactions?.length ?? 0) > 0) return true;
    } catch {
      // Ask again until the deadline.
    }
    if (Date.now() + pollMs > deadline) return false;
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }
};

const directSubmit = async ({ nodeUrl, finalized }: { nodeUrl: string; finalized: TransactionLike }) => {
  const api = await ApiPromise.create({
    provider: new WsProvider(nodeUrl),
    throwOnConnect: false,
    noInitWarn: true,
  });
  try {
    const serialized = finalized.serialize?.();
    if (!(serialized instanceof Uint8Array)) throw new Error('finalized_transaction_not_serializable');
    const extrinsic = api.tx.midnight.sendMnTransaction(u8aToHex(serialized));
    await api.rpc.author.submitExtrinsic(extrinsic.toHex());
  } finally {
    await api.disconnect().catch(() => undefined);
  }
};

export const submitFinalized = async ({
  facade,
  finalized,
  waitForStatus,
}: {
  facade: FacadeLike;
  finalized: TransactionLike;
  waitForStatus: WaitForStatus;
}) => {
  const environment = runtimeEnvironments.get(facade);
  if (environment == null) throw new Error('wallet_runtime_closed');
  await assertNetworkEnvironment(environment);
  // Read before sending, so a missing hash can never turn a sent transaction into an error.
  const txHash = transactionHashOf(finalized);
  await facade.pendingTransactionsService?.addPendingTransaction?.(finalized).catch(() => undefined);
  if (waitForStatus === 'Submitted') {
    await directSubmit({ nodeUrl: environment.nodeWS, finalized });
    return { txHash, blockHash: null, blockHeight: null, directSubmitted: true };
  }
  const submission = await facade.submissionService.submitTransaction(finalized, waitForStatus);
  await waitForIndexedTransaction(environment.indexer, txHash);
  return {
    txHash,
    blockHash: submission.blockHash ?? null,
    blockHeight: submission.blockHeight ?? null,
    directSubmitted: false,
  };
};

export const serializeRuntimeCheckpoint = async ({
  checkpoint = {},
  wallet,
  facade,
  txHistoryStorage,
}: {
  checkpoint?: WalletCheckpoint | null;
  wallet: Omit<WalletRuntimeMaterial, 'seed'>;
  facade: FacadeLike;
  txHistoryStorage: { serialize: () => Promise<unknown> };
}): Promise<WalletCheckpoint> => {
  const environment = runtimeEnvironments.get(facade);
  if (environment == null) throw new Error('wallet_runtime_closed');
  const base = checkpoint ?? {};
  return {
    ...base,
    network: 'mainnet',
    ...checkpointBinding(environment),
    account: wallet.account ?? base.account ?? 0,
    keyIndex: wallet.keyIndex ?? base.keyIndex ?? 0,
    unshieldedAddress: base.unshieldedAddress ?? wallet.unshieldedAddress,
    unshieldedAddressHex: base.unshieldedAddressHex ?? wallet.unshieldedAddressHex,
    syncedAt: new Date().toISOString(),
    shieldedState: await facade.shielded.serializeState(),
    unshieldedState: await facade.unshielded.serializeState(),
    dustState: await facade.dust.serializeState(),
    txHistory: await txHistoryStorage.serialize(),
  };
};
