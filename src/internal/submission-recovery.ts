import type { WalletCheckpoint } from './types.js';

/** What the chain accepted. */
export type NorthStarAcceptedSubmission = {
  /** The transaction hash, as explorers and indexers show it. */
  txId: string;
  blockHash: string | null;
  blockHeight: number | null;
};

/** The transaction was submitted; only saving the checkpoint or closing the wallet failed. */
export class NorthStarPostSubmissionError extends Error {
  readonly code = 'northstar_post_submission_failure';
  readonly submitted = true;
  constructor(
    readonly accepted: NorthStarAcceptedSubmission,
    readonly checkpoint: WalletCheckpoint | null,
    readonly checkpointError: unknown,
    readonly cleanupError: unknown,
  ) {
    super('Transaction submitted. Keep its txId; do not submit a replacement order.', {
      cause: checkpointError ?? cleanupError,
    });
    this.name = 'NorthStarPostSubmissionError';
    // The checkpoint shows the wallet's balances: keep it out of logs and JSON.
    Object.defineProperty(this, 'checkpoint', { enumerable: false });
  }
}

export const completeAcceptedSubmission = async (
  accepted: NorthStarAcceptedSubmission,
  saveCheckpoint: () => Promise<WalletCheckpoint>,
  stop: () => Promise<void>,
): Promise<{ checkpoint: WalletCheckpoint }> => {
  let checkpoint: WalletCheckpoint | null = null;
  let checkpointError: unknown;
  let cleanupError: unknown;
  let failed = false;
  try {
    checkpoint = await saveCheckpoint();
  } catch (error) {
    failed = true;
    checkpointError = error;
  }
  try {
    await stop();
  } catch (error) {
    failed = true;
    cleanupError = error;
  }
  if (failed) throw new NorthStarPostSubmissionError(accepted, checkpoint, checkpointError, cleanupError);
  return { checkpoint: checkpoint! };
};
