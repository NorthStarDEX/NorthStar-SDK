import { createHash } from 'node:crypto';
import type { WalletCheckpoint } from './types.js';

// The SDK supports Midnight Mainnet only.

/** Genesis block hash of Midnight Mainnet. Every node and indexer is checked against it. */
export const MAINNET_GENESIS_HASH = '1941ca8e2bb88146c14dea084d3be7eb6e96ca7135429c543848b628124f2854';

/**
 * Midnight Mainnet node and indexer endpoints. `startProviderRelay()` returns
 * them for Blockfrost; your own endpoints must use https/wss and carry no
 * credentials.
 */
export type Providers = {
  /** Node JSON-RPC over HTTP. */
  node: string;
  /** Node WebSocket. */
  nodeWs: string;
  /** Indexer GraphQL over HTTP. */
  indexer: string;
  /** Indexer GraphQL WebSocket. */
  indexerWs: string;
};

export type Environment = {
  walletNetworkId: string;
  networkId: string;
  indexer: string;
  indexerWS: string;
  nodeWS: string;
  nodeHTTP: string;
  genesisHash: string;
};

export const redactEndpoint = (value: string): string => {
  try {
    const url = new URL(value);
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '[invalid endpoint]';
  }
};
export const redactProviderError = (value: unknown): Error => {
  const message = String(value instanceof Error ? value.message : value);
  return new Error(message.replace(/(?:https?|wss?):\/\/[^\s<>"']+/giu, redactEndpoint));
};

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];
const BLOCKFROST_HOSTS = ['midnight-mainnet.blockfrost.io', 'rpc.midnight-mainnet.blockfrost.io'];
const RETIRED_HOSTS = ['rpc.mainnet.midnight.network', 'indexer.mainnet.midnight.network'];

// Wallet libraries print their URLs when a connection drops, so endpoints never
// carry credentials. Loopback may use plain http/ws (the relay); every other
// host needs TLS. Blockfrost needs a project ID, so it goes through the relay.
const providerEndpoint = (value: unknown, protocols: readonly string[], label: string): string => {
  let url: URL;
  try {
    url = new URL(String(value));
  } catch {
    throw new Error(`provider_${label}_invalid`);
  }
  if (!protocols.includes(url.protocol)) throw new Error(`provider_${label}_invalid`);
  if (url.username || url.password || url.search || url.hash)
    throw new Error(`provider_${label}_must_not_carry_credentials`);
  if (/(?:preprod|preview|testnet)/iu.test(url.hostname))
    throw new Error('mainnet_endpoint_network_mismatch');
  if (RETIRED_HOSTS.includes(url.hostname)) throw new Error('retired_mainnet_endpoint');
  if (BLOCKFROST_HOSTS.includes(url.hostname)) throw new Error('blockfrost_needs_startProviderRelay');
  if (!LOOPBACK_HOSTS.includes(url.hostname) && !['https:', 'wss:'].includes(url.protocol))
    throw new Error(`provider_${label}_requires_tls`);
  return url.toString();
};

export const providerEnvironment = (providers: Providers): Environment => {
  if (providers == null || typeof providers !== 'object') throw new Error('providers_required');
  return Object.freeze({
    walletNetworkId: 'mainnet',
    networkId: 'mainnet',
    genesisHash: MAINNET_GENESIS_HASH,
    nodeHTTP: providerEndpoint(providers.node, ['http:', 'https:'], 'node'),
    nodeWS: providerEndpoint(providers.nodeWs, ['ws:', 'wss:'], 'node_ws'),
    indexer: providerEndpoint(providers.indexer, ['http:', 'https:'], 'indexer'),
    indexerWS: providerEndpoint(providers.indexerWs, ['ws:', 'wss:'], 'indexer_ws'),
  });
};

// Ledger protocol versions supported by the pinned ledger-v8 8.1.0.
export const MAINNET_SUPPORTED_PROTOCOL_VERSIONS = Object.freeze([1000300]);

export const mainnetPost = async (
  url: string,
  body: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<Record<string, any>> => {
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
      redirect: 'error',
    });
  } catch {
    throw new Error('mainnet_network_verification_transport_failed');
  }
  if (!response.ok) throw new Error(`mainnet_network_verification_http_${response.status}`);
  let json: Record<string, any>;
  try {
    json = (await response.json()) as Record<string, any>;
  } catch {
    throw new Error('mainnet_network_verification_invalid_json');
  }
  if (!json || typeof json !== 'object' || json.error || json.errors?.length)
    throw new Error('mainnet_network_verification_response_error');
  return json;
};

export const assertMainnetBlock = async (
  environment: Environment,
  block: any,
  fetchImpl: typeof fetch = fetch,
): Promise<void> => {
  const hash = String(block?.hash ?? '')
    .replace(/^0x/u, '')
    .toLowerCase();
  if (!Number.isSafeInteger(block?.height) || block.height < 0 || !/^[a-f0-9]{64}$/u.test(hash))
    throw new Error('mainnet_indexer_block_invalid');
  if (!MAINNET_SUPPORTED_PROTOCOL_VERSIONS.includes(block.protocolVersion))
    throw new Error('mainnet_protocol_unsupported');
  const canonical = await mainnetPost(
    environment.nodeHTTP,
    { jsonrpc: '2.0', id: 2, method: 'chain_getBlockHash', params: [block.height] },
    fetchImpl,
  );
  if (
    String(canonical.result ?? '')
      .replace(/^0x/u, '')
      .toLowerCase() !== hash
  )
    throw new Error('mainnet_indexer_chain_mismatch');
};

export const assertNetworkEnvironment = async (
  environment: Environment,
  fetchImpl: typeof fetch = fetch,
): Promise<void> => {
  const chain = await mainnetPost(
    environment.nodeHTTP,
    { jsonrpc: '2.0', id: 0, method: 'system_chain', params: [] },
    fetchImpl,
  );
  if (chain.result !== 'Midnight Mainnet') throw new Error('mainnet_chain_name_mismatch');
  const node = await mainnetPost(
    environment.nodeHTTP,
    { jsonrpc: '2.0', id: 1, method: 'chain_getBlockHash', params: [0] },
    fetchImpl,
  );
  if (
    String(node.result ?? '')
      .replace(/^0x/u, '')
      .toLowerCase() !== environment.genesisHash
  )
    throw new Error('mainnet_genesis_mismatch');
  const indexer = await mainnetPost(
    environment.indexer,
    { query: 'query MainnetIdentity { block { height hash protocolVersion } }' },
    fetchImpl,
  );
  await assertMainnetBlock(environment, indexer.data?.block, fetchImpl);
};

export const assertCustomToken = (token: unknown) => {
  const hex =
    typeof token === 'string'
      ? token.trim().replace(/^0x/iu, '').toLowerCase()
      : token instanceof Uint8Array
        ? Buffer.from(token).toString('hex')
        : '';
  if (!/^[a-f0-9]{64}$/u.test(hex) || /^0+$/u.test(hex)) throw new Error('mainnet_custom_token_required');
};

export { guardedPublicDataProvider } from './public-data-provider.js';

// A checkpoint holds indexer sync positions, so it stays with the providers
// and chain it was synced from.
export const checkpointBinding = (environment: Environment) => ({
  genesisHash: environment.genesisHash,
  providerId: createHash('sha256')
    .update(
      JSON.stringify(
        [environment.nodeHTTP, environment.nodeWS, environment.indexer, environment.indexerWS].map(
          redactEndpoint,
        ),
      ),
    )
    .digest('hex'),
});
const assertCheckpointBinding = (checkpoint: WalletCheckpoint, environment: Environment): void => {
  if (!['shieldedState', 'unshieldedState', 'dustState', 'txHistory'].some((key) => checkpoint[key] != null))
    return;
  const binding = checkpointBinding(environment);
  if (checkpoint.genesisHash !== binding.genesisHash || checkpoint.providerId !== binding.providerId)
    throw new Error('mainnet_checkpoint_provider_or_genesis_mismatch');
};

/** A checkpoint must come from Mainnet and from these providers. */
export const assertCheckpoint = (
  checkpoint: WalletCheckpoint | null | undefined,
  environment: Environment,
) => {
  if (checkpoint == null) return;
  if (checkpoint.network == null) throw new Error('checkpoint_network_required');
  if (String(checkpoint.network).trim().toLowerCase() !== 'mainnet')
    throw new Error('checkpoint_network_mismatch');
  assertCheckpointBinding(checkpoint, environment);
};
