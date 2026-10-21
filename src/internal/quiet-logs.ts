// The Midnight wallet libraries print a stack trace each time an indexer
// connection drops and they reconnect, and @polkadot/api prints a line each time
// the wallet closes its node connection, which it does on purpose. Both are
// harmless. Once the SDK opens a wallet it drops exactly those messages and
// prints everything else as before. A wallet that cannot recover still fails
// with a wallet_sync_timeout error naming the last reconnect reason.

const nodeUrls = new Set<string>();
let lastReconnect: string | null = null;
let installed = false;

const reconnectReason = (error: { message?: unknown }): string => {
  const message = String(error.message ?? '');
  if (message.includes('CloseEvent')) return 'indexer_connection_closed';
  if (message.includes('ErrorEvent')) return 'indexer_connection_error';
  return message.slice(0, 200) || 'indexer_sync_error';
};

const isWalletReconnect = (args: unknown[]): boolean =>
  args.length === 1 && (args[0] as { _tag?: unknown } | null)?._tag === 'Wallet.Sync';

const isNodeDisconnect = (args: unknown[]): boolean =>
  args.some(
    (arg) => typeof arg === 'string' && [...nodeUrls].some((url) => arg.includes(`disconnected from ${url}`)),
  );

export const quietWalletLogs = (nodeUrl: string): void => {
  nodeUrls.add(nodeUrl);
  if (installed) return;
  installed = true;
  const print = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (isWalletReconnect(args)) {
      lastReconnect = reconnectReason(args[0] as { message?: unknown });
      return;
    }
    if (isNodeDisconnect(args)) return;
    print(...args);
  };
};

/** Why the wallet last reconnected to the indexer, or null. */
export const lastWalletReconnect = (): string | null => lastReconnect;
