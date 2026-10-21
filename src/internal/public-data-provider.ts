// Midnight.js 4.0.4 public data reads that verify the block before decoding.
import { ContractState } from '@midnight-ntwrk/compact-runtime';
import { LedgerParameters, ZswapChainState } from '@midnight-ntwrk/ledger-v8';
import {
  assertNetworkEnvironment as assertNetwork,
  assertMainnetBlock,
  mainnetPost,
  redactProviderError,
  type Environment,
} from './environment.js';

const queryVerifiedContract = async (
  environment: Environment,
  address: unknown,
  config: any,
  includeZswap: boolean,
) => {
  if (typeof address !== 'string' || !/^[a-f0-9]{64}$/iu.test(address))
    throw new Error('invalid_contract_address');
  let offset: { blockOffset: { height: number } | { hash: string } } | null = null;
  if (config) {
    if (config.type === 'blockHeight' && Number.isSafeInteger(config.blockHeight) && config.blockHeight >= 0)
      offset = { blockOffset: { height: config.blockHeight } };
    else if (config.type === 'blockHash' && /^[a-f0-9]{64}$/iu.test(config.blockHash))
      offset = { blockOffset: { hash: config.blockHash } };
    else throw new Error('invalid_contract_state_offset');
  }
  const result = await mainnetPost(environment.indexer, {
    query: `query MainnetContractState($address: HexEncoded!, $offset: ContractActionOffset) {
      contractAction(address: $address, offset: $offset) {
        state ${includeZswap ? 'zswapState' : ''}
        transaction { block { height hash protocolVersion ${includeZswap ? 'ledgerParameters' : ''} } }
      }
    }`,
    variables: { address, offset },
  });
  if (!result.data || !Object.hasOwn(result.data, 'contractAction'))
    throw new Error('mainnet_indexer_contract_response_invalid');
  const action = result.data.contractAction;
  if (action === null) return null;
  await assertMainnetBlock(environment, action.transaction?.block);
  return action;
};
const bytes = (value: unknown) => {
  if (typeof value !== 'string' || !/^(?:[a-f0-9]{2})+$/iu.test(value))
    throw new Error('mainnet_indexer_state_invalid');
  return Buffer.from(value, 'hex');
};

const queryVerifiedDeploy = async (environment: Environment, address: unknown) => {
  if (typeof address !== 'string' || !/^[a-f0-9]{64}$/iu.test(address))
    throw new Error('invalid_contract_address');
  const result = await mainnetPost(environment.indexer, {
    query: `query MainnetDeployState($address: HexEncoded!) {
      contractAction(address: $address) {
        state transaction { block { height hash protocolVersion } }
        ... on ContractCall { deploy { transaction {
          block { height hash protocolVersion }
          contractActions { address state }
        } } }
      }
    }`,
    variables: { address },
  });
  if (!result.data || !Object.hasOwn(result.data, 'contractAction'))
    throw new Error('mainnet_indexer_contract_response_invalid');
  const action = result.data.contractAction;
  if (action === null) return null;
  const transaction = action.deploy?.transaction ?? action.transaction;
  await assertMainnetBlock(environment, transaction?.block);
  const state = action.deploy
    ? transaction.contractActions?.find(
        (entry: { address: string; state: unknown }) => entry.address === address,
      )?.state
    : action.state;
  return ContractState.deserialize(bytes(state));
};

export const guardedPublicDataProvider = <T extends object>(provider: T, environment: Environment): T => {
  // A plain object, so callers can wrap these methods with their own checks.
  const guarded = { ...provider };
  for (const key of Reflect.ownKeys(provider)) {
    const value = Reflect.get(provider, key);
    if (typeof value !== 'function') continue;
    if (!String(key).startsWith('query') && !String(key).startsWith('watch')) {
      Reflect.set(guarded, key, value.bind(provider));
      continue;
    }
    Reflect.set(guarded, key, async (...args: unknown[]) => {
      await assertNetwork(environment);
      try {
        if (key === 'queryDeployContractState') return await queryVerifiedDeploy(environment, args[0]);
        if (key === 'queryContractState' || key === 'queryZSwapAndContractState') {
          const both = key === 'queryZSwapAndContractState';
          const action = await queryVerifiedContract(environment, args[0], args[1], both);
          if (action == null) return null;
          if (!both) return ContractState.deserialize(bytes(action.state));
          // Returns [ZSwap state, contract state, ledger parameters of that block].
          const zswap = bytes(action.zswapState),
            contract = bytes(action.state),
            parameters = bytes(action.transaction.block.ledgerParameters);
          return [
            ZswapChainState.deserialize(zswap),
            ContractState.deserialize(contract),
            LedgerParameters.deserialize(parameters),
          ];
        }
        const result = await value.apply(provider, args);
        if (key === 'watchForTxData' || key === 'watchForDeployTxData') {
          await assertMainnetBlock(environment, {
            height: result?.blockHeight,
            hash: result?.blockHash,
            protocolVersion: result?.protocolVersion,
          });
        }
        return result;
      } catch (error) {
        throw redactProviderError(error);
      }
    });
  }
  return guarded;
};
