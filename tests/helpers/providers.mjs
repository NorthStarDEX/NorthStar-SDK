// Unroutable loopback endpoints. Tests replace every network call they make.
export const providers = Object.freeze({
  node: 'http://127.0.0.1:9/rpc',
  nodeWs: 'ws://127.0.0.1:9/rpc',
  indexer: 'http://127.0.0.1:9/indexer',
  indexerWs: 'ws://127.0.0.1:9/indexer/ws',
});
