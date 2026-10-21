import { assertNetworkEnvironment, mainnetPost, type Environment } from './environment.js';
const TIMESTAMP_KEY = '0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb';
export const decodeRecentChainTime = (hex: unknown, now = Date.now()): bigint => {
  if (typeof hex !== 'string' || !/^0x[0-9a-f]{16}$/i.test(hex)) throw new Error('chain_timestamp_invalid');
  const bytes = Buffer.from(hex.slice(2), 'hex');
  const ms = bytes.readBigUInt64LE();
  if (
    ms <= 0n ||
    ms > BigInt(Number.MAX_SAFE_INTEGER) ||
    BigInt(now) - ms > 60_000n ||
    ms - BigInt(now) > 30_000n
  )
    throw new Error('chain_timestamp_stale');
  return ms / 1000n;
};
export const readFinalizedChainTime = async (environment: Environment): Promise<bigint> => {
  await assertNetworkEnvironment(environment);
  const rpc = async (method: string, params: unknown[]) => {
    const r = await mainnetPost(environment.nodeHTTP, { jsonrpc: '2.0', id: 1, method, params });
    if (r.error || !Object.hasOwn(r, 'result')) throw new Error('chain_time_rpc_invalid');
    return r.result;
  };
  const hash = await rpc('chain_getFinalizedHead', []);
  if (typeof hash !== 'string' || !/^0x[0-9a-f]{64}$/i.test(hash)) throw new Error('chain_finality_invalid');
  return decodeRecentChainTime(await rpc('state_getStorage', [TIMESTAMP_KEY, hash]));
};
