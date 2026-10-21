import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import { ContractState } from '@midnight-ntwrk/compact-runtime';
import { LedgerParameters, ZswapChainState } from '@midnight-ntwrk/ledger-v8';
import {
  MAINNET_GENESIS_HASH,
  assertCustomToken,
  providerEnvironment,
} from '../dist/internal/environment.js';
import { guardedPublicDataProvider } from '../dist/internal/public-data-provider.js';
import { providers } from './helpers/providers.mjs';

const genesis = MAINNET_GENESIS_HASH;
const hash = 'cd'.repeat(32);
const address = 'ef'.repeat(32);
const environment = () => providerEnvironment(providers);
const block = { height: 123, hash, protocolVersion: 1000300 };
const raw = { state: '01', zswapState: '02', transaction: { block: { ...block, ledgerParameters: '03' } } };
const fixture = (action = raw) => {
  const calls = [];
  mock.method(globalThis, 'fetch', async (_url, options) => {
    const body = JSON.parse(options.body);
    calls.push(body);
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal);
    let json;
    if (body.method === 'system_chain') json = { result: 'Midnight Mainnet' };
    else if (body.method === 'chain_getBlockHash') json = { result: body.params[0] === 0 ? genesis : hash };
    else if (body.query.includes('MainnetIdentity')) json = { data: { block } };
    else if (body.query.includes('MainnetContractState') || body.query.includes('MainnetDeployState'))
      json = { data: { contractAction: action } };
    else assert.fail('unexpected query');
    return { ok: true, json: async () => json };
  });
  const decodes = [];
  for (const [type, name] of [
    [ContractState, 'contract'],
    [ZswapChainState, 'zswap'],
    [LedgerParameters, 'parameters'],
  ]) {
    mock.method(type, 'deserialize', (bytes) => {
      decodes.push([name, Buffer.from(bytes).toString('hex')]);
      return name;
    });
  }
  const provider = guardedPublicDataProvider(
    {
      queryContractState: () => assert.fail('Mainnet must validate the exact raw response before decode'),
      queryDeployContractState: () => assert.fail('Mainnet must verify deployment state before decode'),
      queryZSwapAndContractState: () =>
        assert.fail('Mainnet must validate the exact raw response before decode'),
    },
    environment(),
  );
  return { provider, calls, decodes };
};

test('contract reads verify their exact block before using the installed deserializers', async () => {
  try {
    const { provider, calls, decodes } = fixture();
    assert.equal(
      await provider.queryContractState(address, { type: 'blockHeight', blockHeight: 123 }),
      'contract',
    );
    assert.deepEqual(calls[4].variables, { address, offset: { blockOffset: { height: 123 } } });
    assert.deepEqual(decodes, [['contract', '01']]);
    assert.deepEqual(
      await provider.queryZSwapAndContractState(address, { type: 'blockHash', blockHash: hash }),
      ['zswap', 'contract', 'parameters'],
    );
    assert.deepEqual(calls[10].variables.offset, { blockOffset: { hash } });
    assert.deepEqual(decodes.slice(1), [
      ['zswap', '02'],
      ['contract', '01'],
      ['parameters', '03'],
    ]);
  } finally {
    mock.restoreAll();
  }
});

test('a good tip cannot admit a contract from an unsupported or conflicting block', async () => {
  for (const changed of [
    { protocolVersion: 1000400 },
    { protocolVersion: undefined },
    { hash: '12'.repeat(32) },
    { height: -1 },
  ]) {
    try {
      const { provider, decodes } = fixture({
        ...raw,
        transaction: { block: { ...raw.transaction.block, ...changed } },
      });
      await assert.rejects(
        () => provider.queryContractState(address),
        /mainnet_(protocol_unsupported|indexer_chain_mismatch|indexer_block_invalid)/,
      );
      assert.deepEqual(decodes, []);
    } finally {
      mock.restoreAll();
    }
  }
});

test('missing parameters fail instead of using initial ledger defaults; missing contract remains null', async () => {
  try {
    const { provider } = fixture({ ...raw, transaction: { block } });
    await assert.rejects(() => provider.queryZSwapAndContractState(address), /mainnet_indexer_state_invalid/);
  } finally {
    mock.restoreAll();
  }
  try {
    assert.equal(await fixture(null).provider.queryContractState(address), null);
  } finally {
    mock.restoreAll();
  }
});

test('Mainnet watches reject unsupported confirmation evidence', async () => {
  try {
    fixture();
    const watched = guardedPublicDataProvider(
      { watchForTxData: async () => ({ blockHeight: 123, blockHash: hash, protocolVersion: 1000400 }) },
      environment(),
    );
    await assert.rejects(() => watched.watchForTxData('fixture-id'), /mainnet_protocol_unsupported/);
  } finally {
    mock.restoreAll();
  }
});

test('Mainnet token inputs require a nonzero custom type', () => {
  for (const token of ['0'.repeat(64), new Uint8Array(32), '', 'ab', undefined])
    assert.throws(() => assertCustomToken(token), /mainnet_custom_token_required/);
  assertCustomToken('12'.repeat(32));
  assertCustomToken(new Uint8Array(32).fill(1));
});

test('Mainnet pools reject a native leg or bond and identical token legs', async () => {
  const { assertPoolTokenScope } = await import('../dist/internal/pool-state.js');
  const ledger = {
    tokenTypeA: '12'.repeat(32),
    tokenTypeB: '34'.repeat(32),
    orderBondTokenType: '56'.repeat(32),
  };
  assertPoolTokenScope(ledger);
  for (const field of Object.keys(ledger))
    assert.throws(
      () => assertPoolTokenScope({ ...ledger, [field]: '0'.repeat(64) }),
      /custom_token_required/,
    );
  assert.throws(
    () => assertPoolTokenScope({ ...ledger, tokenTypeB: ledger.tokenTypeA }),
    /tokens_must_differ/,
  );
});

test('deployment lookup verifies the originating block and selects the requested deployed contract', async () => {
  try {
    const action = {
      ...raw,
      deploy: {
        transaction: {
          block,
          contractActions: [
            { address: '11'.repeat(32), state: '99' },
            { address, state: '04' },
          ],
        },
      },
    };
    const { provider, decodes } = fixture(action);
    assert.equal(await provider.queryDeployContractState(address), 'contract');
    assert.deepEqual(decodes, [['contract', '04']]);
  } finally {
    mock.restoreAll();
  }
  try {
    const { provider, decodes } = fixture({
      ...raw,
      deploy: {
        transaction: {
          block: { ...block, protocolVersion: 1000400 },
          contractActions: [{ address, state: '04' }],
        },
      },
    });
    await assert.rejects(() => provider.queryDeployContractState(address), /mainnet_protocol_unsupported/);
    assert.deepEqual(decodes, []);
  } finally {
    mock.restoreAll();
  }
});

test('consumer method replacements remain effective after a successful Mainnet read', async () => {
  try {
    const { provider } = fixture();
    assert.equal(await provider.queryContractState(address), 'contract');
    const query = provider.queryContractState.bind(provider);
    provider.queryContractState = async (...args) => {
      await query(...args);
      throw new Error('exact_contract_verifier_rejected');
    };
    await assert.rejects(() => provider.queryContractState(address), /exact_contract_verifier_rejected/);
    const both = provider.queryZSwapAndContractState.bind(provider);
    provider.queryZSwapAndContractState = async (...args) => {
      await both(...args);
      throw new Error('exact_contract_tuple_rejected');
    };
    await assert.rejects(() => provider.queryZSwapAndContractState(address), /exact_contract_tuple_rejected/);
  } finally {
    mock.restoreAll();
  }
});

test('actual SDK verifier and custom-token guards survive Mainnet provider method replacement', async () => {
  const { assertCompatibleContractState, DEFAULT_COMPILED_DIR, assertAuditedArtifacts } = await import(
    '../dist/internal/artifacts.js'
  );
  const { assertPoolTokenScope } = await import('../dist/internal/pool-state.js');
  const { readFileSync } = await import('node:fs');
  const path = await import('node:path');
  const release = assertAuditedArtifacts();
  const valid = {
    operations: () => [...release.releaseCircuits],
    operation: (name) => ({
      verifierKey: readFileSync(path.join(DEFAULT_COMPILED_DIR, 'keys', name + '.verifier')),
    }),
    ledger: { tokenTypeA: '12'.repeat(32), tokenTypeB: '34'.repeat(32), orderBondTokenType: '56'.repeat(32) },
  };
  let selected = valid;
  try {
    const { provider } = fixture();
    mock.method(ContractState, 'deserialize', () => selected);
    assert.equal(await provider.queryContractState(address), valid);
    for (const method of ['queryContractState', 'queryZSwapAndContractState']) {
      const original = provider[method].bind(provider);
      provider[method] = async (...args) => {
        const result = await original(...args);
        const state = method === 'queryContractState' ? result : result[1];
        assertCompatibleContractState(state, DEFAULT_COMPILED_DIR);
        assertPoolTokenScope(state.ledger);
        return result;
      };
    }
    for (const changed of [
      { ...valid, operation: () => ({ verifierKey: Uint8Array.of(1) }) },
      { ...valid, ledger: { ...valid.ledger, tokenTypeB: '0'.repeat(64) } },
    ]) {
      selected = changed;
      await assert.rejects(
        () => provider.queryContractState(address),
        /verifier_mismatch|custom_token_required/,
      );
      await assert.rejects(
        () => provider.queryZSwapAndContractState(address),
        /verifier_mismatch|custom_token_required/,
      );
    }
  } finally {
    mock.restoreAll();
  }
});
