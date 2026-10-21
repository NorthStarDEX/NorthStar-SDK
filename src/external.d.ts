declare module '@midnight-ntwrk/compact-js/effect' {
  export const CompiledContract: {
    make: (
      name: string,
      contract: unknown,
    ) => { pipe: (...steps: Array<(value: unknown) => unknown>) => unknown };
    withWitnesses: (witnesses: Record<string, unknown>) => (contract: unknown) => unknown;
    withCompiledFileAssets: (compiledDir: string) => (contract: unknown) => unknown;
  };
}

declare module '@midnight-ntwrk/midnight-js-contracts' {
  type SerializedTxLike = {
    serialize?: () => Uint8Array | Buffer | string;
    identifiers?: () => unknown[];
    transactionHash?: () => unknown;
  };

  export const findDeployedContract: (providers: unknown, options: unknown) => Promise<unknown>;
  export const createUnprovenCallTx: (
    providers: unknown,
    options: unknown,
  ) => Promise<{ private: { unprovenTx: SerializedTxLike } }>;
}

declare module '@midnight-ntwrk/midnight-js-indexer-public-data-provider' {
  export const indexerPublicDataProvider: (
    indexerUrl: string,
    indexerWsUrl: string,
  ) => {
    queryContractState: (contractAddress: string) => Promise<unknown>;
    queryZSwapAndContractState: (contractAddress: string) => Promise<[unknown, unknown, unknown] | null>;
    watchForTxData: (txId: string) => Promise<unknown>;
  };
}

declare module '@midnight-ntwrk/midnight-js-level-private-state-provider' {
  export const levelPrivateStateProvider: (options: {
    midnightDbName: string;
    privateStateStoreName?: string | null;
    signingKeyStoreName: string;
    privateStoragePasswordProvider: () => string;
    accountId: string;
  }) => unknown;
}

declare module '@midnight-ntwrk/midnight-js-network-id' {
  export const setNetworkId: (networkId: unknown) => void;
}

declare module '@midnight-ntwrk/midnight-js-node-zk-config-provider' {
  export class NodeZkConfigProvider {
    constructor(compiledDir: string);
  }
}

declare module '@midnight-ntwrk/wallet-sdk-hd' {
  type HdWalletResult = {
    type: string;
    hdWallet: {
      clear: () => void;
    };
  };

  export const Roles: {
    Zswap: unknown;
    NightExternal: unknown;
    Dust: unknown;
  };

  export const HDWallet: {
    fromSeed: (seed: Uint8Array | Buffer) => HdWalletResult;
  };
}
