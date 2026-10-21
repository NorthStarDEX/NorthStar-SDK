/** Liquidity order timing. */
export const PUBLIC_LIQUIDITY_DELAY_SECONDS = 2_592_061n;
export const LIQUIDITY_EXPIRY_GAP_SECONDS = 86_400n;
export const MAX_LIQUIDITY_TTL_SECONDS = 5_184_000n;
export const CLIENT_LIQUIDITY_TTL_SECONDS = 3_456_000;
export const CREATION_HEADROOM_SECONDS = 240n;
export const liquidityAdmissionTiming = (chainSeconds: bigint, ttlSeconds = CLIENT_LIQUIDITY_TTL_SECONDS) => {
  if (!Number.isSafeInteger(ttlSeconds)) throw new Error('liquidity_ttl_invalid');
  const creationTimeUpperBound = chainSeconds + CREATION_HEADROOM_SECONDS;
  const publicSettleAfter = creationTimeUpperBound + PUBLIC_LIQUIDITY_DELAY_SECONDS;
  const deadline = creationTimeUpperBound + BigInt(ttlSeconds);
  if (
    chainSeconds <= 0n ||
    deadline >= 1n << 64n ||
    deadline < publicSettleAfter + LIQUIDITY_EXPIRY_GAP_SECONDS ||
    deadline > chainSeconds + MAX_LIQUIDITY_TTL_SECONDS
  )
    throw new Error('liquidity_expiry_out_of_range');
  return { creationTimeUpperBound, publicSettleAfter, deadline };
};
export const requireLiquidityAdmissionWindow = (
  chainSeconds: bigint,
  upperBound: bigint,
  deadline: bigint,
  minimumHeadroom = 30n,
) => {
  if (
    upperBound < chainSeconds + minimumHeadroom ||
    upperBound > chainSeconds + 300n ||
    deadline < upperBound + PUBLIC_LIQUIDITY_DELAY_SECONDS + LIQUIDITY_EXPIRY_GAP_SECONDS ||
    deadline > chainSeconds + MAX_LIQUIDITY_TTL_SECONDS
  )
    throw new Error('liquidity_admission_window_stale');
};
export const publicLiquidityState = (
  order: { direction: unknown; publicSettleAfter?: unknown; deadline: unknown } | null,
  chainSeconds: bigint,
) => {
  if (!order) return 'closed' as const;
  if (![2, 3].includes(Number(order.direction))) return 'not-liquidity' as const;
  if (chainSeconds > BigInt(String(order.deadline))) return 'expired' as const;
  const unlock = BigInt(String(order.publicSettleAfter ?? 0));
  if (unlock <= 0n) throw new Error('liquidity_unlock_missing');
  return chainSeconds >= unlock ? ('mature' as const) : ('waiting' as const);
};
