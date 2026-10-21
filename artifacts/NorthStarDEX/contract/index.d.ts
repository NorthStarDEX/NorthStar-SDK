import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum Direction { AtoB = 0,
                        BtoA = 1,
                        LiquidityAdd = 2,
                        LiquidityRemove = 3
}

export type Order = { cancelCommitment: Uint8Array;
                      owner: { bytes: Uint8Array };
                      recipient: { bytes: Uint8Array };
                      direction: Direction;
                      amountIn: bigint;
                      amountAux: bigint;
                      minAmountOut: bigint;
                      deadline: bigint;
                      publicSettleAfter: bigint
                    };

export type SettleResult = { executed: boolean;
                             amountIn: bigint;
                             amountOut: bigint
                           };

export type LiquiditySettleResult = { amountA: bigint;
                                      amountB: bigint;
                                      lpAmount: bigint
                                    };

export type DivResultU128ByU64 = { quotient: bigint; remainder: bigint };

export type Witnesses<PS> = {
  wit_divU128ByU64(context: __compactRuntime.WitnessContext<Ledger, PS>,
                   dividend_0: bigint,
                   divisor_0: bigint): [PS, DivResultU128ByU64];
  wit_sqrtU128(context: __compactRuntime.WitnessContext<Ledger, PS>,
               value_0: bigint): [PS, bigint];
  localSk(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  cancelSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  setBatcherAuthorization(context: __compactRuntime.CircuitContext<PS>,
                          batcherAuthId_0: Uint8Array,
                          allowed_0: boolean,
                          expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  setProtocolFeeConfig(context: __compactRuntime.CircuitContext<PS>,
                       newProtocolFeeRecipientBytes_0: Uint8Array,
                       newProtocolFeeShareBps_0: bigint,
                       expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimProtocolFees(context: __compactRuntime.CircuitContext<PS>,
                    expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, SettleResult>;
  depositLiquidity(context: __compactRuntime.CircuitContext<PS>,
                   amountA_0: bigint,
                   amountB_0: bigint,
                   minLpOut_0: bigint,
                   recipientBytes_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  depositOrder(context: __compactRuntime.CircuitContext<PS>,
               orderId_0: Uint8Array,
               direction_0: Direction,
               amountIn_0: bigint,
               minAmountOut_0: bigint,
               recipientBytes_0: Uint8Array,
               ownerBytes_0: Uint8Array,
               deadline_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelOrder(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettleResult>;
  liquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                 liquidityId_0: Uint8Array,
                 direction_0: Direction,
                 amountIn_0: bigint,
                 amountAux_0: bigint,
                 minAmountOut_0: bigint,
                 recipientBytes_0: Uint8Array,
                 ownerBytes_0: Uint8Array,
                 deadline_0: bigint,
                 creationTimeUpperBound_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelLiquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                       liquidityId_0: Uint8Array): __compactRuntime.CircuitResults<PS, LiquiditySettleResult>;
  settleLiquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                       liquidityId_0: Uint8Array): __compactRuntime.CircuitResults<PS, LiquiditySettleResult>;
  settleOne(context: __compactRuntime.CircuitContext<PS>, orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettleResult>;
  settleBatchUpTo5(context: __compactRuntime.CircuitContext<PS>,
                   orderCount_0: bigint,
                   orderIdA_0: Uint8Array,
                   orderIdB_0: Uint8Array,
                   orderIdC_0: Uint8Array,
                   orderIdD_0: Uint8Array,
                   orderIdE_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type ProvableCircuits<PS> = {
  setBatcherAuthorization(context: __compactRuntime.CircuitContext<PS>,
                          batcherAuthId_0: Uint8Array,
                          allowed_0: boolean,
                          expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  setProtocolFeeConfig(context: __compactRuntime.CircuitContext<PS>,
                       newProtocolFeeRecipientBytes_0: Uint8Array,
                       newProtocolFeeShareBps_0: bigint,
                       expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimProtocolFees(context: __compactRuntime.CircuitContext<PS>,
                    expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, SettleResult>;
  depositLiquidity(context: __compactRuntime.CircuitContext<PS>,
                   amountA_0: bigint,
                   amountB_0: bigint,
                   minLpOut_0: bigint,
                   recipientBytes_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  depositOrder(context: __compactRuntime.CircuitContext<PS>,
               orderId_0: Uint8Array,
               direction_0: Direction,
               amountIn_0: bigint,
               minAmountOut_0: bigint,
               recipientBytes_0: Uint8Array,
               ownerBytes_0: Uint8Array,
               deadline_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelOrder(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettleResult>;
  liquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                 liquidityId_0: Uint8Array,
                 direction_0: Direction,
                 amountIn_0: bigint,
                 amountAux_0: bigint,
                 minAmountOut_0: bigint,
                 recipientBytes_0: Uint8Array,
                 ownerBytes_0: Uint8Array,
                 deadline_0: bigint,
                 creationTimeUpperBound_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelLiquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                       liquidityId_0: Uint8Array): __compactRuntime.CircuitResults<PS, LiquiditySettleResult>;
  settleLiquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                       liquidityId_0: Uint8Array): __compactRuntime.CircuitResults<PS, LiquiditySettleResult>;
  settleOne(context: __compactRuntime.CircuitContext<PS>, orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettleResult>;
  settleBatchUpTo5(context: __compactRuntime.CircuitContext<PS>,
                   orderCount_0: bigint,
                   orderIdA_0: Uint8Array,
                   orderIdB_0: Uint8Array,
                   orderIdC_0: Uint8Array,
                   orderIdD_0: Uint8Array,
                   orderIdE_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  setBatcherAuthorization(context: __compactRuntime.CircuitContext<PS>,
                          batcherAuthId_0: Uint8Array,
                          allowed_0: boolean,
                          expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  setProtocolFeeConfig(context: __compactRuntime.CircuitContext<PS>,
                       newProtocolFeeRecipientBytes_0: Uint8Array,
                       newProtocolFeeShareBps_0: bigint,
                       expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimProtocolFees(context: __compactRuntime.CircuitContext<PS>,
                    expectedMasterActionNonce_0: bigint): __compactRuntime.CircuitResults<PS, SettleResult>;
  depositLiquidity(context: __compactRuntime.CircuitContext<PS>,
                   amountA_0: bigint,
                   amountB_0: bigint,
                   minLpOut_0: bigint,
                   recipientBytes_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  depositOrder(context: __compactRuntime.CircuitContext<PS>,
               orderId_0: Uint8Array,
               direction_0: Direction,
               amountIn_0: bigint,
               minAmountOut_0: bigint,
               recipientBytes_0: Uint8Array,
               ownerBytes_0: Uint8Array,
               deadline_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelOrder(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettleResult>;
  liquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                 liquidityId_0: Uint8Array,
                 direction_0: Direction,
                 amountIn_0: bigint,
                 amountAux_0: bigint,
                 minAmountOut_0: bigint,
                 recipientBytes_0: Uint8Array,
                 ownerBytes_0: Uint8Array,
                 deadline_0: bigint,
                 creationTimeUpperBound_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelLiquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                       liquidityId_0: Uint8Array): __compactRuntime.CircuitResults<PS, LiquiditySettleResult>;
  settleLiquidityOrder(context: __compactRuntime.CircuitContext<PS>,
                       liquidityId_0: Uint8Array): __compactRuntime.CircuitResults<PS, LiquiditySettleResult>;
  settleOne(context: __compactRuntime.CircuitContext<PS>, orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettleResult>;
  settleBatchUpTo5(context: __compactRuntime.CircuitContext<PS>,
                   orderCount_0: bigint,
                   orderIdA_0: Uint8Array,
                   orderIdB_0: Uint8Array,
                   orderIdC_0: Uint8Array,
                   orderIdD_0: Uint8Array,
                   orderIdE_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  readonly masterAuthId: Uint8Array;
  readonly tokenTypeA: Uint8Array;
  readonly tokenTypeB: Uint8Array;
  readonly lpTokenDomain: Uint8Array;
  readonly lpFeeBps: bigint;
  readonly orderBondTokenType: Uint8Array;
  readonly orderBondAmount: bigint;
  readonly protocolFeeRecipientBytes: Uint8Array;
  readonly protocolFeeShareBps: bigint;
  readonly claimableProtocolFeeA: bigint;
  readonly claimableProtocolFeeB: bigint;
  readonly lpTokenType: Uint8Array;
  readonly totalLPSupply: bigint;
  readonly reserveA: bigint;
  readonly reserveB: bigint;
  orderBook: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Order;
    [Symbol.iterator](): Iterator<[Uint8Array, Order]>
  };
  authorizedBatchers: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  readonly masterActionNonce: bigint;
  readonly deployerAuthId: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               tokenTypeA__0: Uint8Array,
               tokenTypeB__0: Uint8Array,
               lpFeeBps__0: bigint,
               masterAuthId__0: Uint8Array,
               initialBatcherAuthId__0: Uint8Array,
               protocolFeeRecipientBytes__0: Uint8Array,
               orderBondTokenType__0: Uint8Array,
               orderBondAmount__0: bigint): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
