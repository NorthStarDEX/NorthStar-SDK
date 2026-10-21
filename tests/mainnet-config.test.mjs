import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAINNET_GENESIS_HASH,
  providerEnvironment,
  assertNetworkEnvironment as assertNetwork,
  redactEndpoint,
  redactProviderError,
  checkpointBinding,
  assertCheckpoint,
} from '../dist/internal/environment.js';
import { providers } from './helpers/providers.mjs';

const block = 'cd'.repeat(32);
const environment = () => providerEnvironment(providers);
const responses = (values) => {
  values.unshift({ result: 'Midnight Mainnet' });
  const calls = [];
  return {
    calls,
    fetch: async (url, options) => {
      calls.push({ url, options });
      const next = values.shift();
      if (next instanceof Error) throw next;
      return { ok: true, status: 200, json: async () => next };
    },
  };
};

test('providers must be credential-free Mainnet endpoints, with TLS off loopback', () => {
  assert.throws(() => providerEnvironment(undefined), /providers_required/);
  const selfHosted = {
    node: 'https://node.example/',
    nodeWs: 'wss://node.example/',
    indexer: 'https://indexer.example/api/v4/graphql',
    indexerWs: 'wss://indexer.example/api/v4/graphql/ws',
  };
  assert.equal(providerEnvironment(selfHosted).indexer, selfHosted.indexer);
  assert.equal(providerEnvironment(providers).nodeWS, providers.nodeWs);
  for (const [change, error] of [
    [{ node: 'http://node.example/' }, /provider_node_requires_tls/],
    [{ nodeWs: 'ws://node.example/' }, /provider_node_ws_requires_tls/],
    [{ indexer: 'https://indexer.example/?token=x' }, /provider_indexer_must_not_carry_credentials/],
    [{ indexer: 'https://user:pass@indexer.example/' }, /must_not_carry_credentials/],
    [{ node: 'wss://node.example/' }, /provider_node_invalid/],
    [{ indexerWs: 'not a url' }, /provider_indexer_ws_invalid/],
    [{ indexer: 'https://indexer.preprod.midnight.network/' }, /mainnet_endpoint_network_mismatch/],
    [{ node: 'https://rpc.mainnet.midnight.network/' }, /retired_mainnet_endpoint/],
    [{ node: 'https://rpc.midnight-mainnet.blockfrost.io/' }, /blockfrost_needs_startProviderRelay/],
  ])
    assert.throws(() => providerEnvironment({ ...selfHosted, ...change }), error);
});

test('mainnet validates genesis and indexer block against node before use', async () => {
  const mock = responses([
    { result: '0x' + MAINNET_GENESIS_HASH },
    { data: { block: { height: 123, hash: block, protocolVersion: 1000300 } } },
    { result: '0x' + block },
  ]);
  await assertNetwork(environment(), mock.fetch);
  assert.equal(mock.calls.length, 4);
  assert.deepEqual(JSON.parse(mock.calls[1].options.body).params, [0]);
  assert.deepEqual(JSON.parse(mock.calls[3].options.body).params, [123]);
  assert.ok(mock.calls.every(({ options }) => options.redirect === 'error' && options.signal));
});

test('wrong genesis, mixed indexer, HTTP errors and malformed data fail closed', async () => {
  await assert.rejects(
    () => assertNetwork(environment(), responses([{ result: block }]).fetch),
    /mainnet_genesis_mismatch/,
  );
  await assert.rejects(
    () =>
      assertNetwork(
        environment(),
        responses([
          { result: MAINNET_GENESIS_HASH },
          { data: { block: { height: 123, hash: block, protocolVersion: 1000300 } } },
          { result: MAINNET_GENESIS_HASH },
        ]).fetch,
      ),
    /mainnet_indexer_chain_mismatch/,
  );
  await assert.rejects(
    () =>
      assertNetwork(
        environment(),
        responses([{ result: MAINNET_GENESIS_HASH }, { data: { block: { height: '123', hash: block } } }])
          .fetch,
      ),
    /mainnet_indexer_block_invalid/,
  );
  for (const status of [401, 403, 429, 503])
    await assert.rejects(
      () => assertNetwork(environment(), async () => ({ ok: false, status })),
      new RegExp(`http_${status}`),
    );
  await assert.rejects(
    () =>
      assertNetwork(environment(), responses([new Error('https://rpc.example/?project_id=secret')]).fetch),
    (error) => !error.message.includes('secret'),
  );
});

test('a node reporting the wrong network name is rejected', async () => {
  await assert.rejects(
    () =>
      assertNetwork(environment(), async () => ({
        ok: true,
        json: async () => ({ result: 'Midnight Preprod' }),
      })),
    /mainnet_chain_name_mismatch/,
  );
});

test('missing, string and unsupported Mainnet ledger protocols fail closed before canonical lookup', async () => {
  for (const protocolVersion of [undefined, null, '1000300', 1000200, 1000400, -1]) {
    const mock = responses([
      { result: MAINNET_GENESIS_HASH },
      { data: { block: { height: 123, hash: block, protocolVersion } } },
    ]);
    await assert.rejects(() => assertNetwork(environment(), mock.fetch), /mainnet_protocol_unsupported/);
    assert.equal(mock.calls.length, 3);
  }
});

test('diagnostics remove all URL credentials and query values', () => {
  assert.equal(
    redactEndpoint('https://name:password@example.test/path?project_id=SECRET&token=OTHER#hash'),
    'https://example.test/path',
  );
  assert.equal(
    redactProviderError(new Error('failed wss://example.test/path?project_id=SECRET')).message,
    'failed wss://example.test/path',
  );
});

test('saved wallet state is bound to the providers and genesis it was synced with', () => {
  const profile = environment();
  assertCheckpoint({ network: 'mainnet', unshieldedAddress: 'fixture' }, profile);
  assertCheckpoint({ network: 'mainnet', dustState: 'fixture', ...checkpointBinding(profile) }, profile);
  const otherProviders = providerEnvironment({ ...providers, indexer: 'http://127.0.0.1:10/indexer' });
  for (const fixture of [
    { network: 'mainnet', dustState: 'fixture' },
    { network: 'mainnet', dustState: 'fixture', ...checkpointBinding(profile), genesisHash: 'ef'.repeat(32) },
    { network: 'mainnet', dustState: 'fixture', ...checkpointBinding(otherProviders) },
  ])
    assert.throws(() => assertCheckpoint(fixture, profile), /provider_or_genesis_mismatch/);
});

test('SDK constructor and checkpoint replacement reject another network before wallet activity', async () => {
  const { NorthStarSDK } = await import('../dist/sdk.js');
  const options = { providers, seed: 'synthetic-unused-seed' };
  assert.throws(
    () => new NorthStarSDK({ ...options, checkpoint: { network: 'preprod' } }),
    /checkpoint_network_mismatch|unsupported_network/,
  );
  assert.throws(() => new NorthStarSDK({ ...options, checkpoint: {} }), /checkpoint_network_required/);
  assert.throws(
    () => new NorthStarSDK({ ...options, checkpoint: { network: 'mainnet', dustState: 'fixture' } }),
    /checkpoint_provider_or_genesis_mismatch/,
  );
  const sdk = new NorthStarSDK(options);
  assert.throws(
    () => sdk.setCheckpoint({ network: 'preprod' }),
    /checkpoint_network_mismatch|unsupported_network/,
  );
  assert.equal(sdk.checkpoint, null);
});
