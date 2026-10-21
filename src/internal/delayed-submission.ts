import {
  FailEntirely,
  FailFallible,
  SucceedEntirely,
  SegmentFail,
  SegmentSuccess,
} from '@midnight-ntwrk/midnight-js-types';
import { createHash } from 'node:crypto';
import { ContractCall, Transaction } from '@midnight-ntwrk/ledger-v8';
import { constants } from 'node:fs';
import { mkdir, open, rename, unlink, lstat, realpath } from 'node:fs/promises';
import path from 'node:path';
import type { Environment } from './environment.js';

// Journal records name their network; this SDK writes Mainnet only.
const DEFAULT_NETWORK = 'mainnet';
import { readFinalizedChainTime } from './chain-time.js';
import { AMM_RELEASE_ID } from './artifacts.js';
import { publicLiquidityState, requireLiquidityAdmissionWindow } from './liquidity-timing.js';
import { readPool } from '../transaction-builder.js';
import { quoteLiquidityOrder } from './quotes.js';
import type { UnknownRecord } from './types.js';
type Order = {
  built: {
    releaseId: string;
    sourceSha256: string;
    compiledDir: string;
    contractAddress: string;
    circuitId: string;
  };
  orderId: string | null;
  creationTimeUpperBound?: string;
  quote: { deadline?: string; publicSettleAfter?: string } | null;
};
const isLiquiditySubmission = (order: Order) =>
  ['liquidityOrder', 'settleLiquidityOrder'].includes(order.built.circuitId);

export const checkDelayedSubmission = async (order: Order, environment: Environment) => {
  const pool = await readPool({
    contractAddress: order.built.contractAddress,
    compiledDir: order.built.compiledDir,
    environment,
  });
  if (pool.releaseId !== order.built.releaseId) throw new Error('delayed_submission_release_changed');
  const time = await readFinalizedChainTime(environment);
  if (order.built.circuitId === 'liquidityOrder')
    requireLiquidityAdmissionWindow(
      time,
      BigInt(order.creationTimeUpperBound!),
      BigInt(order.quote!.deadline!),
    );
  if (order.built.circuitId === 'settleLiquidityOrder') {
    const stored = (pool.ledger?.orderBookEntries as UnknownRecord[]).find(
      (entry) => entry.orderId === order.orderId,
    );
    if (publicLiquidityState((stored as never) ?? null, time) !== 'mature')
      throw new Error('public_liquidity_not_mature');
    const quote = quoteLiquidityOrder({
      order: stored as never,
      reserveA: String(pool.ledger?.reserveA),
      reserveB: String(pool.ledger?.reserveB),
      totalLPSupply: String(pool.ledger?.totalLPSupply),
      now: new Date(Number(time) * 1000),
    });
    if (!quote.eligible) throw new Error('public_liquidity_unfillable:' + quote.reason);
  }
};
const json = (value: unknown) =>
  JSON.stringify(value, (_k, v) => (typeof v === 'bigint' ? String(v) : v), 2) + '\n';
const syncDirectory = async (directory: string) => {
  const h = await open(directory, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
  try {
    await h.sync();
  } finally {
    await h.close();
  }
};
const exactAction = (
  tx: unknown,
  address: string,
  circuit: string,
  identity?: { actionSegment: number; actionIntentHash: string },
) => {
  const intents = (
    tx as { intents?: Map<number, { actions: unknown[]; intentHash: (segment: number) => string }> }
  ).intents;
  const actions = [...(intents?.entries() ?? [])].flatMap(([segment, intent]) =>
    intent.actions.map((action) => ({ segment, intent, action })),
  );
  const matches = actions.filter(
    ({ segment, intent, action }) =>
      action instanceof ContractCall &&
      action.address === address &&
      (typeof action.entryPoint === 'string'
        ? action.entryPoint
        : new TextDecoder().decode(action.entryPoint)) === circuit &&
      (!identity ||
        (identity.actionSegment === segment && identity.actionIntentHash === intent.intentHash(segment))),
  );
  if (matches.length !== 1 || (!identity && actions.length !== 1))
    throw new Error('delayed_submission_action_mismatch');
  return {
    actionSegment: matches[0].segment,
    actionIntentHash: matches[0].intent.intentHash(matches[0].segment),
  };
};
const namespace = (r: {
  network: string;
  genesisHash: unknown;
  releaseId: string;
  walletScope: string;
  contractAddress: string;
  orderId: string;
  circuitId: string;
}) =>
  createHash('sha256')
    .update(
      JSON.stringify([
        r.network,
        r.genesisHash,
        r.releaseId,
        r.walletScope,
        r.contractAddress,
        r.orderId,
        r.circuitId,
      ]),
    )
    .digest('hex') + '.json';
const locked = async <T>(file: string, run: () => Promise<T>): Promise<T> => {
  const lock = file + '.lock';
  let h;
  try {
    h = await open(
      lock,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o600,
    );
  } catch {
    throw new Error('delayed_submission_locked:retain_journal_and_check_owner');
  }
  try {
    await h.writeFile(json({ pid: process.pid, createdAt: new Date().toISOString() }));
    await h.sync();
    return await run();
  } finally {
    await h.close();
    await unlink(lock);
    await syncDirectory(path.dirname(file));
  }
};
const recordText = async (file: string) => {
  const h = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await h.stat();
    if (!stat.isFile() || stat.size > 2_100_000) throw new Error('delayed_submission_record_invalid');
    return await h.readFile('utf8');
  } finally {
    await h.close();
  }
};
/**
 * Re-checks a liquidity order or public settlement just before it is sent.
 * With a `journalDir`, it first saves the balanced transaction there; an
 * unknown result is then never resent until the journal is resolved.
 */
export const withDelayedSubmission = async <T>({
  order,
  environment,
  journalDir,
  walletScope,
  tx,
  submit,
}: {
  order: Order;
  environment: Environment;
  journalDir?: string | null;
  /** The submitting wallet's unshielded address, hex. */
  walletScope: string;
  tx: { identifiers?: () => unknown[]; serialize?: () => Uint8Array };
  submit: () => Promise<T>;
}): Promise<T> => {
  if (!isLiquiditySubmission(order)) return submit();
  await checkDelayedSubmission(order, environment);
  if (journalDir == null) return submit();
  const network = DEFAULT_NETWORK;
  const txId = String(tx.identifiers?.()[0] ?? '');
  if (!/^(?:[0-9a-f]{64}|[0-9a-f]{66})$/i.test(txId) || !tx.serialize)
    throw new Error('delayed_submission_identity_missing');
  const directory = path.resolve(journalDir);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  if (typeof walletScope !== 'string' || !/^[0-9a-f]{64}$/i.test(walletScope))
    throw new Error('delayed_submission_wallet_scope_missing');
  const genesisHash = environment.genesisHash;
  const file = path.join(
    directory,
    namespace({
      network,
      genesisHash,
      releaseId: order.built.releaseId,
      walletScope,
      contractAddress: order.built.contractAddress,
      orderId: String(order.orderId),
      circuitId: order.built.circuitId,
    }),
  );
  const actionIdentity = exactAction(tx, order.built.contractAddress, order.built.circuitId);
  const serialized = Buffer.from(tx.serialize());
  if (serialized.length > 1_048_576) throw new Error('delayed_submission_bytes_too_large');
  const roundTrip = Transaction.deserialize('signature', 'proof', 'binding', serialized);
  if (!Buffer.from(roundTrip.serialize()).equals(serialized) || !roundTrip.identifiers().includes(txId))
    throw new Error('delayed_submission_serialized_mismatch');
  exactAction(roundTrip, order.built.contractAddress, order.built.circuitId, actionIdentity);
  const value = {
    version: 1,
    network,
    genesisHash,
    walletScope,
    txId,
    ...actionIdentity,
    contractAddress: order.built.contractAddress,
    orderId: order.orderId,
    releaseId: order.built.releaseId,
    sourceSha256: order.built.sourceSha256,
    circuitId: order.built.circuitId,
    creationTimeUpperBound: order.creationTimeUpperBound,
    publicSettleAfter: order.quote?.publicSettleAfter,
    deadline: order.quote?.deadline,
    transactionHex: serialized.toString('hex'),
    state: 'submission-unknown',
    createdAt: new Date().toISOString(),
  };
  await locked(file, async () => {
    try {
      await lstat(path.join(file + '.resolved', txId + '.json'));
      throw new Error('delayed_submission_archived_transaction:build_a_fresh_attempt_do_not_rebroadcast');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    let handle;
    try {
      handle = await open(
        file,
        constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
        0o600,
      );
    } catch {
      throw new Error('delayed_submission_journal_exists:reconcile_before_new_submission');
    }
    try {
      await handle.writeFile(json(value));
      await handle.sync();
    } finally {
      await handle.close();
    }
    await syncDirectory(directory);
  });
  try {
    const result = await submit();
    await locked(file, async () => {
      let text;
      try {
        text = await recordText(file);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
        throw error;
      }
      const current = JSON.parse(text);
      if (current.txId !== value.txId) throw new Error('delayed_submission_active_record_changed');
      const temp = file + '.accepted.tmp';
      const h = await open(
        temp,
        constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
        0o600,
      );
      try {
        await h.writeFile(json({ ...value, state: 'accepted' }));
        await h.sync();
      } finally {
        await h.close();
      }
      await rename(temp, file);
      await syncDirectory(directory);
    });
    return result;
  } catch (error) {
    throw new Error(`delayed_submission_unknown:${txId}:retain_journal_and_reconcile_do_not_rebroadcast`, {
      cause: error,
    });
  }
};
/** Checks a saved submission against the chain. Never resends it. */
export const reconcileDelayedSubmission = async (file: string, environment: Environment) => {
  const record = JSON.parse(await recordText(file));
  if (
    !Number.isInteger(record.actionSegment) ||
    !/^([0-9a-f]{64})$/.test(record.actionIntentHash ?? '') ||
    record.version !== 1 ||
    record.network !== DEFAULT_NETWORK ||
    record.releaseId !== AMM_RELEASE_ID ||
    !['liquidityOrder', 'settleLiquidityOrder'].includes(record.circuitId) ||
    typeof record.transactionHex !== 'string' ||
    !/^(?:[0-9a-f]{2})+$/i.test(record.transactionHex)
  )
    throw new Error('delayed_submission_record_invalid');
  if (
    record.genesisHash !== environment.genesisHash ||
    typeof record.walletScope !== 'string' ||
    !/^[0-9a-f]{64}$/i.test(record.walletScope)
  )
    throw new Error('delayed_submission_scope_mismatch');
  if (path.basename(file) !== namespace(record)) throw new Error('delayed_submission_namespace_mismatch');
  const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
  const tx = Transaction.deserialize(
    'signature',
    'proof',
    'binding',
    Buffer.from(record.transactionHex, 'hex'),
  );
  if (
    !Buffer.from(tx.serialize()).equals(Buffer.from(record.transactionHex, 'hex')) ||
    !tx.identifiers().includes(record.txId)
  )
    throw new Error('delayed_submission_transaction_mismatch');
  exactAction(tx, record.contractAddress, record.circuitId, record);
  const { createReadProviders } = await import('./pool-state.js');
  const providers = createReadProviders({ environment });
  const provider = providers.publicDataProvider as unknown as {
    watchForTxData: (id: string) => Promise<{
      identifiers: string[];
      tx: { identifiers: () => string[] };
      blockHash: string;
      status: unknown;
      segmentStatusMap?: Map<number, unknown>;
    }>;
    queryContractState: (
      address: string,
      config: { type: 'blockHash'; blockHash: string },
    ) => Promise<unknown>;
  };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const receipt = await Promise.race([
    provider.watchForTxData(record.txId),
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error('delayed_submission_confirmation_pending:retain_active_journal')),
        12_000,
      );
    }),
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
  if (!receipt.identifiers.includes(record.txId) || !receipt.tx.identifiers().includes(record.txId))
    throw new Error('delayed_submission_receipt_mismatch');
  exactAction(receipt.tx, record.contractAddress, record.circuitId, record);
  const state = await provider.queryContractState(record.contractAddress, {
    type: 'blockHash',
    blockHash: receipt.blockHash,
  });
  const { selectCompatibleRelease } = await import('./artifacts.js');
  const selected = selectCompatibleRelease(state);
  if (selected.releaseId !== record.releaseId || selected.sourceSha256 !== record.sourceSha256)
    throw new Error('delayed_submission_receipt_release_mismatch');
  return { record, receipt };
};

/** Archives a saved submission once the chain shows its final result. */
export const resolveDelayedSubmission = async (file: string, environment: Environment) =>
  locked(file, async () => {
    const { record, receipt } = await reconcileDelayedSubmission(file, environment);
    if (![SucceedEntirely, FailEntirely, FailFallible].includes(receipt.status as never))
      throw new Error('delayed_submission_not_terminal:retain_active_journal');
    const segmentStatus = receipt.segmentStatusMap?.get(record.actionSegment);
    const intents = (receipt.tx as unknown as { intents: Map<number, { actions: unknown[] }> }).intents;
    const guaranteed = intents
      .get(record.actionSegment)
      ?.actions.some(
        (action) =>
          action instanceof ContractCall &&
          (action as unknown as { guaranteedTranscript?: unknown }).guaranteedTranscript,
      );
    const outcome =
      receipt.status === SucceedEntirely ||
      (receipt.status === FailFallible && segmentStatus === SegmentSuccess)
        ? 'confirmed'
        : receipt.status === FailEntirely || (segmentStatus === SegmentFail && !guaranteed)
          ? 'failed'
          : 'pending';
    if (outcome === 'pending') throw new Error('delayed_submission_not_terminal:retain_active_journal');
    const encoded = await recordText(file),
      archiveDirectory = file + '.resolved';
    await mkdir(archiveDirectory, { recursive: true, mode: 0o700 });
    const archiveStat = await lstat(archiveDirectory);
    if (
      !archiveStat.isDirectory() ||
      archiveStat.isSymbolicLink() ||
      (await realpath(archiveDirectory)) !==
        path.join(await realpath(path.dirname(file)), path.basename(archiveDirectory))
    )
      throw new Error('delayed_submission_unsafe_archive_directory');
    await syncDirectory(archiveDirectory);
    const archive = path.join(archiveDirectory, record.txId + '.json');
    try {
      const h = await open(
        archive,
        constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
        0o400,
      );
      try {
        await h.writeFile(encoded);
        await h.sync();
      } finally {
        await h.close();
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST' || (await recordText(archive)) !== encoded)
        throw error;
    }
    const receiptFile = path.join(archiveDirectory, record.txId + '.receipt.json');
    const evidence = json({
      version: 1,
      txId: record.txId,
      outcome,
      blockHash: receipt.blockHash,
      releaseId: record.releaseId,
      actionSegment: record.actionSegment,
      actionIntentHash: record.actionIntentHash,
    });
    try {
      const h = await open(
        receiptFile,
        constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
        0o400,
      );
      try {
        await h.writeFile(evidence);
        await h.sync();
      } finally {
        await h.close();
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST' || (await recordText(receiptFile)) !== evidence)
        throw error;
    }
    await syncDirectory(archiveDirectory);
    await syncDirectory(path.dirname(file));
    await unlink(file);
    await syncDirectory(path.dirname(file));
    return { record, receipt, outcome, archive };
  });
