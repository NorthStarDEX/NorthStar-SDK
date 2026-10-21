// A NorthStar pool built offline with the real contract: the constructor and
// the creator's first deposit both run locally. `mainnetFetch` answers like
// the Midnight node and indexer, so SDK reads see this pool with no network.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  ChargedState,
  ContractMaintenanceAuthority,
  createConstructorContext,
} from '@midnight-ntwrk/compact-runtime';
import * as CompactJS from '@midnight-ntwrk/compact-js/effect';
import { LedgerParameters, ZswapChainState, ZswapSecretKeys } from '@midnight-ntwrk/ledger-v8';
import { createUnprovenCallTxFromInitialStates } from '@midnight-ntwrk/midnight-js-contracts';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';

import * as compiled from '../../artifacts/NorthStarDEX/contract/index.js';
import { DEFAULT_COMPILED_DIR } from '../../dist/internal/artifacts.js';
import { MAINNET_GENESIS_HASH } from '../../dist/internal/environment.js';
import { makeWitnessBundle } from '../../dist/internal/wallet-secrets.js';

export const POOL_ADDRESS = 'ab'.repeat(32);
export const TOKEN_A = '01'.repeat(32);
export const TOKEN_B = '02'.repeat(32);
export const BOND_AMOUNT = 1000n;
const BLOCK = { height: 123, hash: 'cd'.repeat(32), protocolVersion: 1000300 };

const bytes = (hex) => new Uint8Array(Buffer.from(hex, 'hex'));
const toHex = (value) => Buffer.from(value).toString('hex');

/**
 * Builds a pool. With `reserveA`/`reserveB`, the creator funds it first.
 * `authority` defaults to test IDs; `maintenanceThreshold` 0 leaves the pool upgradable.
 */
export const buildPoolState = async ({
  reserveA,
  reserveB,
  lpFeeBps = 30n,
  authority = {
    masterAuthId: '04'.repeat(32),
    batcherAuthId: '05'.repeat(32),
    protocolFeeRecipient: '06'.repeat(32),
  },
  maintenanceThreshold = 1,
} = {}) => {
  setNetworkId('mainnet');
  const keys = ZswapSecretKeys.fromSeed(new Uint8Array(32).fill(7));
  const creatorSecret = new Uint8Array(32).fill(0x33);
  const witnesses = makeWitnessBundle({ creatorSecretBytes: creatorSecret });
  const created = new compiled.Contract(witnesses).initialState(
    createConstructorContext({}, keys.coinPublicKey),
    bytes(TOKEN_A),
    bytes(TOKEN_B),
    lpFeeBps,
    bytes(authority.masterAuthId),
    bytes(authority.batcherAuthId),
    bytes(authority.protocolFeeRecipient),
    bytes(TOKEN_A),
    BOND_AMOUNT,
  );
  const state = created.currentContractState;
  for (const name of state.operations()) {
    const operation = state.operation(name);
    operation.verifierKey = readFileSync(path.join(DEFAULT_COMPILED_DIR, 'keys', `${name}.verifier`));
    state.setOperation(name, operation);
  }
  state.maintenanceAuthority = new ContractMaintenanceAuthority([], maintenanceThreshold, 0n);
  if (reserveA != null) {
    const funded = await createUnprovenCallTxFromInitialStates(
      new NodeZkConfigProvider(DEFAULT_COMPILED_DIR),
      {
        compiledContract: CompactJS.CompiledContract.make('NorthStarDEX', compiled.Contract).pipe(
          CompactJS.CompiledContract.withWitnesses(witnesses),
          CompactJS.CompiledContract.withCompiledFileAssets(DEFAULT_COMPILED_DIR),
        ),
        contractAddress: POOL_ADDRESS,
        circuitId: 'depositLiquidity',
        args: [reserveA, reserveB, 1n, new Uint8Array(32).fill(8)],
        coinPublicKey: keys.coinPublicKey,
        initialContractState: state,
        initialZswapChainState: new ZswapChainState(),
        ledgerParameters: LedgerParameters.initialParameters(),
      },
      keys.encryptionPublicKey,
    );
    state.data = new ChargedState(funded.public.nextContractState);
  }
  keys.clear();
  return toHex(state.serialize());
};

/** The decoded ledger of a contract state (or of a circuit's next state). */
export const poolLedger = (stateValue) => compiled.ledger(stateValue);

/**
 * A `fetch` replacement that answers the Mainnet identity checks and serves
 * `contractStateHex()` as the pool's current state. Records each request.
 */
export const mainnetFetch = (contractStateHex) => {
  const requests = [];
  const handler = async (_url, options) => {
    const body = JSON.parse(options.body);
    requests.push(body);
    let json;
    if (body.method === 'system_chain') json = { result: 'Midnight Mainnet' };
    else if (body.method === 'chain_getBlockHash')
      json = { result: `0x${body.params[0] === 0 ? MAINNET_GENESIS_HASH : BLOCK.hash}` };
    else if (body.method === 'chain_getFinalizedHead') json = { result: `0x${BLOCK.hash}` };
    else if (body.method === 'state_getStorage') {
      // The finalized block's timestamp: now, in milliseconds, little-endian.
      const now = Buffer.alloc(8);
      now.writeBigUInt64LE(BigInt(Date.now()));
      json = { result: `0x${now.toString('hex')}` };
    } else if (body.query?.includes('MainnetIdentity')) json = { data: { block: BLOCK } };
    else if (body.query?.includes('MainnetContractState'))
      json = {
        data: {
          contractAction: {
            state: contractStateHex(),
            zswapState: toHex(new ZswapChainState().serialize()),
            transaction: {
              block: { ...BLOCK, ledgerParameters: toHex(LedgerParameters.initialParameters().serialize()) },
            },
          },
        },
      };
    else throw new Error(`unexpected_fixture_request:${JSON.stringify(body).slice(0, 80)}`);
    return new Response(JSON.stringify(json), { headers: { 'content-type': 'application/json' } });
  };
  return { handler, requests };
};
