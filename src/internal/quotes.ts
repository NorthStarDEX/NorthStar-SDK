export const MAX_FEE_DENOMINATOR = 10_000n;
export const MIN_SWAP_AMOUNT = 1_000n;

type NumericInput = string | number | bigint | null | undefined;

type QuoteOrder = {
  direction?: NumericInput;
  amountIn?: NumericInput;
  amountAux?: NumericInput;
  minAmountOut?: NumericInput;
  deadline?: NumericInput;
};

export type SwapOrderQuoteInput = {
  order?: QuoteOrder;
  reserveA?: NumericInput;
  reserveB?: NumericInput;
  lpFeeBps?: NumericInput;
  protocolFeeShareBps?: NumericInput;
  now?: Date | string | number;
};

export type LiquidityOrderQuoteInput = {
  order?: QuoteOrder;
  reserveA?: NumericInput;
  reserveB?: NumericInput;
  totalLPSupply?: NumericInput;
  now?: Date | string | number;
};

export type SlippageInput = {
  quotedAmount: NumericInput;
  slippageBps: NumericInput;
  minimum?: NumericInput;
};

const bigintValue = (value: NumericInput, fallback = 0n): bigint => {
  if (value == null || value === '') return fallback;
  return BigInt(String(value));
};

const bigintText = (value: bigint): string => BigInt(value).toString();

const unixSeconds = (value: Date | string | number = new Date()): bigint => {
  const ms = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(ms) ? BigInt(Math.floor(ms / 1000)) : BigInt(Math.floor(Date.now() / 1000));
};

export const orderDeadlineExpired = ({
  order,
  now = new Date(),
}: { order?: QuoteOrder; now?: Date | string | number } = {}): boolean => {
  const deadline = bigintValue(order?.deadline);
  return deadline > 0n && unixSeconds(now) > deadline;
};

export const quoteSwapOrder = ({
  order,
  reserveA,
  reserveB,
  lpFeeBps,
  protocolFeeShareBps,
  now = new Date(),
}: SwapOrderQuoteInput = {}) => {
  const direction = Number(order?.direction);
  if (![0, 1].includes(direction)) {
    return { eligible: false, reason: `unsupported_swap_direction:${order?.direction ?? 'missing'}` };
  }

  const amountIn = bigintValue(order?.amountIn);
  const minAmountOut = bigintValue(order?.minAmountOut);
  const currentReserveA = bigintValue(reserveA);
  const currentReserveB = bigintValue(reserveB);
  const feeBps = bigintValue(lpFeeBps);

  if (orderDeadlineExpired({ order, now })) return { eligible: false, reason: 'order_expired' };
  if (currentReserveA <= 0n || currentReserveB <= 0n)
    return { eligible: false, reason: 'pool_has_no_liquidity' };
  if (amountIn < MIN_SWAP_AMOUNT) return { eligible: false, reason: 'amount_in_below_minimum' };
  if (minAmountOut <= 0n) return { eligible: false, reason: 'min_amount_out_zero' };
  if (feeBps < 5n || feeBps > 2000n) return { eligible: false, reason: 'lp_fee_bps_invalid' };

  const effectiveIn = (amountIn * (MAX_FEE_DENOMINATOR - feeBps)) / MAX_FEE_DENOMINATOR;
  if (effectiveIn <= 0n) return { eligible: false, reason: 'trade_too_small_after_fee' };

  const totalFee = amountIn - effectiveIn;
  const retainedFee =
    order?.amountAux == null
      ? (totalFee * bigintValue(protocolFeeShareBps)) / MAX_FEE_DENOMINATOR
      : bigintValue(order.amountAux);
  if (retainedFee > totalFee) return { eligible: false, reason: 'retained_fee_exceeds_swap_fee' };

  const reserveAmountIn = amountIn - retainedFee;
  const reserveIn = direction === 0 ? currentReserveA : currentReserveB;
  const reserveOut = direction === 0 ? currentReserveB : currentReserveA;
  const amountOut = (effectiveIn * reserveOut) / (reserveIn + effectiveIn);
  if (amountOut <= 0n) return { eligible: false, reason: 'zero_output_quote' };
  if (amountOut < minAmountOut) {
    return {
      eligible: false,
      reason: 'amount_out_below_minimum',
      quotedAmountOut: bigintText(amountOut),
      minAmountOut: bigintText(minAmountOut),
    };
  }
  if (amountOut > reserveOut) return { eligible: false, reason: 'amount_out_exceeds_reserve' };

  const nextReserveA = direction === 0 ? currentReserveA + reserveAmountIn : currentReserveA - amountOut;
  const nextReserveB = direction === 0 ? currentReserveB - amountOut : currentReserveB + reserveAmountIn;
  if (nextReserveA < 0n || nextReserveB < 0n)
    return { eligible: false, reason: 'negative_post_match_reserve' };

  return {
    eligible: true,
    reason: null,
    amountIn: bigintText(amountIn),
    retainedFee: bigintText(retainedFee),
    reserveAmountIn: bigintText(reserveAmountIn),
    quotedAmountOut: bigintText(amountOut),
    minAmountOut: bigintText(minAmountOut),
    nextReserveA: bigintText(nextReserveA),
    nextReserveB: bigintText(nextReserveB),
  };
};

const ceilDiv = (numerator: bigint, denominator: bigint): bigint => {
  if (denominator <= 0n) throw new Error('ceil_div_denominator_not_positive');
  return numerator === 0n ? 0n : (numerator + denominator - 1n) / denominator;
};

export const quoteLiquidityOrder = ({
  order,
  reserveA,
  reserveB,
  totalLPSupply,
  now = new Date(),
}: LiquidityOrderQuoteInput = {}) => {
  const direction = Number(order?.direction);
  if (![2, 3].includes(direction)) {
    return { eligible: false, reason: `unsupported_liquidity_direction:${order?.direction ?? 'missing'}` };
  }

  const amountIn = bigintValue(order?.amountIn);
  const amountAux = bigintValue(order?.amountAux);
  const minAmountOut = bigintValue(order?.minAmountOut);
  const currentReserveA = bigintValue(reserveA);
  const currentReserveB = bigintValue(reserveB);
  const currentLPSupply = bigintValue(totalLPSupply);

  if (orderDeadlineExpired({ order, now })) return { eligible: false, reason: 'order_expired' };
  if (currentLPSupply <= 0n)
    return { eligible: false, reason: direction === 2 ? 'pool_not_initialized' : 'no_lp_supply' };
  if (currentReserveA <= 0n || currentReserveB <= 0n) {
    return { eligible: false, reason: direction === 2 ? 'invalid_reserves' : 'pool_has_no_liquidity' };
  }

  if (direction === 2) {
    if (amountIn <= 0n) return { eligible: false, reason: 'token_a_amount_zero' };
    if (amountAux <= 0n) return { eligible: false, reason: 'token_b_amount_zero' };
    if (minAmountOut <= 0n) return { eligible: false, reason: 'min_lp_out_zero' };

    const lpOut =
      amountIn * currentReserveB <= amountAux * currentReserveA
        ? (amountIn * currentLPSupply) / currentReserveA
        : (amountAux * currentLPSupply) / currentReserveB;
    if (lpOut <= 0n) return { eligible: false, reason: 'insufficient_liquidity_amounts' };
    if (lpOut < minAmountOut) {
      return {
        eligible: false,
        reason: 'lp_out_below_minimum',
        quotedLpOut: bigintText(lpOut),
        minAmountOut: bigintText(minAmountOut),
      };
    }
    const usedAmountA = ceilDiv(lpOut * currentReserveA, currentLPSupply);
    const usedAmountB = ceilDiv(lpOut * currentReserveB, currentLPSupply);
    if (usedAmountA > amountIn) return { eligible: false, reason: 'token_a_usage_exceeds_max' };
    if (usedAmountB > amountAux) return { eligible: false, reason: 'token_b_usage_exceeds_max' };
    return {
      eligible: true,
      reason: null,
      direction: 'LiquidityAdd',
      amountIn: bigintText(amountIn),
      amountAux: bigintText(amountAux),
      minAmountOut: bigintText(minAmountOut),
      quotedLpOut: bigintText(lpOut),
      usedAmountA: bigintText(usedAmountA),
      usedAmountB: bigintText(usedAmountB),
      nextReserveA: bigintText(currentReserveA + usedAmountA),
      nextReserveB: bigintText(currentReserveB + usedAmountB),
      nextTotalLPSupply: bigintText(currentLPSupply + lpOut),
    };
  }

  if (amountIn <= 0n) return { eligible: false, reason: 'lp_amount_zero' };
  if (amountIn > currentLPSupply - 1n)
    return { eligible: false, reason: 'lp_amount_exceeds_circulating_supply' };
  const amountAOut = (amountIn * currentReserveA) / currentLPSupply;
  const amountBOut = (amountIn * currentReserveB) / currentLPSupply;
  if (amountAOut < amountAux)
    return { eligible: false, reason: 'amount_a_below_minimum', quotedAmountAOut: bigintText(amountAOut) };
  if (amountBOut < minAmountOut)
    return { eligible: false, reason: 'amount_b_below_minimum', quotedAmountBOut: bigintText(amountBOut) };
  if (amountAOut <= 0n && amountBOut <= 0n) return { eligible: false, reason: 'both_outputs_zero' };
  return {
    eligible: true,
    reason: null,
    direction: 'LiquidityRemove',
    lpAmount: bigintText(amountIn),
    minAmountAOut: bigintText(amountAux),
    minAmountBOut: bigintText(minAmountOut),
    quotedAmountAOut: bigintText(amountAOut),
    quotedAmountBOut: bigintText(amountBOut),
    nextReserveA: bigintText(currentReserveA - amountAOut),
    nextReserveB: bigintText(currentReserveB - amountBOut),
    nextTotalLPSupply: bigintText(currentLPSupply - amountIn),
  };
};

/** Slippage in basis points: 0 to 10,000 (100 = 1%). */
export const checkSlippageBps = (slippageBps: NumericInput): bigint => {
  if (typeof slippageBps === 'number' && !Number.isSafeInteger(slippageBps))
    throw new Error('slippage_bps_out_of_range');
  if (!/^\d+$/u.test(String(slippageBps))) throw new Error('slippage_bps_out_of_range');
  const bps = BigInt(String(slippageBps));
  if (bps > 10_000n) throw new Error('slippage_bps_out_of_range');
  return bps;
};

export const applySlippageBps = ({ quotedAmount, slippageBps, minimum = 1n }: SlippageInput): string => {
  const quote = BigInt(String(quotedAmount));
  const bps = checkSlippageBps(slippageBps);
  const adjusted = (quote * (10_000n - bps)) / 10_000n;
  const min = BigInt(String(minimum));
  return adjusted < min ? min.toString() : adjusted.toString();
};
