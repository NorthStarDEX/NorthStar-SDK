import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';

import { hexFromBytes } from './common.js';
import { guardedPublicDataProvider, assertCustomToken, type Environment } from './environment.js';
import { loadCompiledModule, selectCompatibleRelease } from './artifacts.js';
import type { HexInput, UnknownRecord } from './types.js';

type IterableEntries = Iterable<[unknown, unknown]>;

const optionalHex = (value: unknown): string | null =>
  value == null ? null : hexFromBytes(value as HexInput);
const bigintText = (value: unknown, fallback = '0'): string =>
  value == null ? fallback : BigInt(String(value)).toString();

const hasIterator = (value: unknown): value is IterableEntries =>
  value != null && typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function';

const safeMapEntries = (value: unknown): [unknown, unknown][] => {
  if (value == null) return [];
  if (value instanceof Map) return [...value.entries()];
  if (hasIterator(value)) return [...value];
  return [];
};

const mapSize = (value: unknown): string => {
  if (value == null) return '0';
  const candidate = value as { size?: unknown };
  if (typeof candidate.size === 'function') return BigInt(String(candidate.size())).toString();
  if (typeof candidate.size === 'number') return String(candidate.size);
  return String(safeMapEntries(value).length);
};

const orderKind = (direction: unknown): string => ([2, 3].includes(Number(direction)) ? 'liquidity' : 'swap');

const summarizeOrderBook = (value: unknown) =>
  safeMapEntries(value)
    .map(([orderId, order]) => {
      const entry = order as UnknownRecord;
      const direction = Number(entry.direction);
      return {
        orderId: hexFromBytes(orderId as HexInput),
        kind: orderKind(direction),
        direction: Number.isFinite(direction) ? direction : String(entry.direction),
        amountIn: bigintText(entry.amountIn),
        amountAux: bigintText(entry.amountAux),
        minAmountOut: bigintText(entry.minAmountOut),
        deadline: bigintText(entry.deadline),
        publicSettleAfter: entry.publicSettleAfter == null ? null : bigintText(entry.publicSettleAfter),
        owner: optionalHex((entry.owner as UnknownRecord | undefined)?.bytes),
        recipient: optionalHex((entry.recipient as UnknownRecord | undefined)?.bytes),
      };
    })
    .sort((left, right) => String(left.orderId).localeCompare(String(right.orderId)));

const summarizeLedger = (ledger: UnknownRecord) => ({
  tokenTypeA: optionalHex(ledger.tokenTypeA),
  tokenTypeB: optionalHex(ledger.tokenTypeB),
  lpTokenType: optionalHex(ledger.lpTokenType),
  lpFeeBps: bigintText(ledger.lpFeeBps),
  orderBondTokenType: optionalHex(ledger.orderBondTokenType),
  orderBondAmount: bigintText(ledger.orderBondAmount),
  protocolFeeShareBps: bigintText(ledger.protocolFeeShareBps),
  claimableProtocolFeeA: bigintText(ledger.claimableProtocolFeeA),
  claimableProtocolFeeB: bigintText(ledger.claimableProtocolFeeB),
  masterActionNonce: bigintText(ledger.masterActionNonce),
  deployerAuthId: optionalHex(ledger.deployerAuthId),
  masterAuthId: optionalHex(ledger.masterAuthId),
  protocolFeeRecipient: optionalHex(ledger.protocolFeeRecipientBytes),
  // Active batchers have the value 1; removed ones are deleted from the map.
  batcherAuthIds: safeMapEntries(ledger.authorizedBatchers)
    .filter(([, active]) => String(active) === '1')
    .map(([id]) => hexFromBytes(id as HexInput))
    .sort(),
  totalLPSupply: bigintText(ledger.totalLPSupply),
  reserveA: bigintText(ledger.reserveA),
  reserveB: bigintText(ledger.reserveB),
  orderBookSize: mapSize(ledger.orderBook),
  orderBookEntries: summarizeOrderBook(ledger.orderBook),
});

export const assertPoolTokenScope = (ledger: UnknownRecord): void => {
  for (const token of [ledger.tokenTypeA, ledger.tokenTypeB, ledger.orderBondTokenType])
    assertCustomToken(token);
  if (hexFromBytes(ledger.tokenTypeA as HexInput) === hexFromBytes(ledger.tokenTypeB as HexInput))
    throw new Error('mainnet_pool_tokens_must_differ');
};

/** Decode a contract state with the release decoder and check its token scope. */
export const assertStateTokenScope = (
  compiledModule: { ledger: (data: never) => unknown },
  state: unknown,
): void => assertPoolTokenScope(compiledModule.ledger((state as { data: never }).data) as UnknownRecord);

export const createReadProviders = ({ environment }: { environment: Environment }) => {
  return {
    publicDataProvider: guardedPublicDataProvider(
      indexerPublicDataProvider(environment.indexer, environment.indexerWS),
      environment,
    ),
  };
};

export const readPoolState = async ({
  contractAddress,
  environment,
  compiledDir,
  compiledModule,
}: {
  contractAddress: string;
  environment: Environment;
  compiledDir?: string;
  compiledModule?: unknown;
}) => {
  const providers = createReadProviders({ environment });
  const state = (await providers.publicDataProvider.queryContractState(
    contractAddress,
  )) as UnknownRecord | null;
  const release = state == null ? null : selectCompatibleRelease(state, compiledDir);
  let ledger: UnknownRecord | null = null;
  if (release != null) {
    const moduleToUse = (await loadCompiledModule(release.compiledDir)) as {
      ledger: (data: unknown) => UnknownRecord;
    };
    if (compiledModule != null && compiledModule !== moduleToUse) {
      throw new Error('amm_compiled_module_release_mismatch');
    }
    ledger = moduleToUse.ledger(state!.data);
    assertPoolTokenScope(ledger);
  }
  const summarized = ledger == null ? null : summarizeLedger(ledger);
  // Locked when no maintenance update can ever gather enough signatures.
  const maintenance = (
    state as { maintenanceAuthority?: { committee?: unknown[]; threshold?: unknown } } | null
  )?.maintenanceAuthority;
  const maintenanceLocked =
    maintenance != null && Number(maintenance.threshold) > (maintenance.committee?.length ?? 0);
  const reserveA = BigInt(summarized?.reserveA ?? 0n);
  const reserveB = BigInt(summarized?.reserveB ?? 0n);
  return {
    contractAddress,
    exists: ledger != null,
    releaseId: release?.releaseId ?? null,
    sourceSha256: release?.sourceSha256 ?? null,
    ledger: summarized,
    maintenanceLocked,
    derived: {
      priceBPerA: reserveA === 0n ? null : Number(reserveB) / Number(reserveA),
      priceAPerB: reserveB === 0n ? null : Number(reserveA) / Number(reserveB),
    },
  };
};
