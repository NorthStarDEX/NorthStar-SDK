import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var Direction;
(function (Direction) {
  Direction[Direction['AtoB'] = 0] = 'AtoB';
  Direction[Direction['BtoA'] = 1] = 'BtoA';
  Direction[Direction['LiquidityAdd'] = 2] = 'LiquidityAdd';
  Direction[Direction['LiquidityRemove'] = 3] = 'LiquidityRemove';
})(Direction || (Direction = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_3 = __compactRuntime.CompactTypeBoolean;

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _UserAddress_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_5 = new _UserAddress_0();

class _SwapExecution_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      reserveAmountIn: _descriptor_0.fromValue(value_0),
      amountOut: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.reserveAmountIn).concat(_descriptor_0.toValue(value_0.amountOut));
  }
}

const _descriptor_6 = new _SwapExecution_0();

class _WithdrawLiquidityResult_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      amountAOut: _descriptor_0.fromValue(value_0),
      amountBOut: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.amountAOut).concat(_descriptor_0.toValue(value_0.amountBOut));
  }
}

const _descriptor_7 = new _WithdrawLiquidityResult_0();

class _LiquidityPlan_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      usedAmountA: _descriptor_0.fromValue(value_0),
      usedAmountB: _descriptor_0.fromValue(value_0),
      lpOut: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.usedAmountA).concat(_descriptor_0.toValue(value_0.usedAmountB).concat(_descriptor_0.toValue(value_0.lpOut)));
  }
}

const _descriptor_8 = new _LiquidityPlan_0();

const _descriptor_9 = new __compactRuntime.CompactTypeEnum(3, 1);

class _Order_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment().concat(_descriptor_9.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))))))));
  }
  fromValue(value_0) {
    return {
      cancelCommitment: _descriptor_1.fromValue(value_0),
      owner: _descriptor_5.fromValue(value_0),
      recipient: _descriptor_5.fromValue(value_0),
      direction: _descriptor_9.fromValue(value_0),
      amountIn: _descriptor_0.fromValue(value_0),
      amountAux: _descriptor_0.fromValue(value_0),
      minAmountOut: _descriptor_0.fromValue(value_0),
      deadline: _descriptor_0.fromValue(value_0),
      publicSettleAfter: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.cancelCommitment).concat(_descriptor_5.toValue(value_0.owner).concat(_descriptor_5.toValue(value_0.recipient).concat(_descriptor_9.toValue(value_0.direction).concat(_descriptor_0.toValue(value_0.amountIn).concat(_descriptor_0.toValue(value_0.amountAux).concat(_descriptor_0.toValue(value_0.minAmountOut).concat(_descriptor_0.toValue(value_0.deadline).concat(_descriptor_0.toValue(value_0.publicSettleAfter)))))))));
  }
}

const _descriptor_10 = new _Order_0();

class _SettleResult_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      executed: _descriptor_3.fromValue(value_0),
      amountIn: _descriptor_0.fromValue(value_0),
      amountOut: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.executed).concat(_descriptor_0.toValue(value_0.amountIn).concat(_descriptor_0.toValue(value_0.amountOut)));
  }
}

const _descriptor_11 = new _SettleResult_0();

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _MixedBatchAccumulator_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_12.alignment())))))));
  }
  fromValue(value_0) {
    return {
      nextReserveA: _descriptor_0.fromValue(value_0),
      nextReserveB: _descriptor_0.fromValue(value_0),
      protocolFeeTotalA: _descriptor_0.fromValue(value_0),
      protocolFeeTotalB: _descriptor_0.fromValue(value_0),
      scheduledOutA: _descriptor_4.fromValue(value_0),
      scheduledOutB: _descriptor_4.fromValue(value_0),
      scheduledBondOut: _descriptor_4.fromValue(value_0),
      settledOrders: _descriptor_12.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.nextReserveA).concat(_descriptor_0.toValue(value_0.nextReserveB).concat(_descriptor_0.toValue(value_0.protocolFeeTotalA).concat(_descriptor_0.toValue(value_0.protocolFeeTotalB).concat(_descriptor_4.toValue(value_0.scheduledOutA).concat(_descriptor_4.toValue(value_0.scheduledOutB).concat(_descriptor_4.toValue(value_0.scheduledBondOut).concat(_descriptor_12.toValue(value_0.settledOrders))))))));
  }
}

const _descriptor_13 = new _MixedBatchAccumulator_0();

class _LiquiditySettleResult_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      amountA: _descriptor_0.fromValue(value_0),
      amountB: _descriptor_0.fromValue(value_0),
      lpAmount: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.amountA).concat(_descriptor_0.toValue(value_0.amountB).concat(_descriptor_0.toValue(value_0.lpAmount)));
  }
}

const _descriptor_14 = new _LiquiditySettleResult_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_15 = new _ContractAddress_0();

class _DivResultU128ByU64_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      quotient: _descriptor_0.fromValue(value_0),
      remainder: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.quotient).concat(_descriptor_0.toValue(value_0.remainder));
  }
}

const _descriptor_16 = new _DivResultU128ByU64_0();

const _descriptor_17 = new __compactRuntime.CompactTypeVector(2, _descriptor_1);

const _descriptor_18 = new __compactRuntime.CompactTypeVector(3, _descriptor_1);

class _Either_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_1.fromValue(value_0),
      right: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_1.toValue(value_0.left).concat(_descriptor_1.toValue(value_0.right)));
  }
}

const _descriptor_19 = new _Either_0();

class _Either_1 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_15.alignment().concat(_descriptor_5.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_15.fromValue(value_0),
      right: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_15.toValue(value_0.left).concat(_descriptor_5.toValue(value_0.right)));
  }
}

const _descriptor_20 = new _Either_1();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.wit_divU128ByU64) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named wit_divU128ByU64');
    }
    if (typeof(witnesses_0.wit_sqrtU128) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named wit_sqrtU128');
    }
    if (typeof(witnesses_0.localSk) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localSk');
    }
    if (typeof(witnesses_0.cancelSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named cancelSecret');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      setBatcherAuthorization: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`setBatcherAuthorization: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const batcherAuthId_0 = args_1[1];
        const allowed_0 = args_1[2];
        const expectedMasterActionNonce_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setBatcherAuthorization',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 155 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(batcherAuthId_0.buffer instanceof ArrayBuffer && batcherAuthId_0.BYTES_PER_ELEMENT === 1 && batcherAuthId_0.length === 32)) {
          __compactRuntime.typeError('setBatcherAuthorization',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 155 char 1',
                                     'Bytes<32>',
                                     batcherAuthId_0)
        }
        if (!(typeof(allowed_0) === 'boolean')) {
          __compactRuntime.typeError('setBatcherAuthorization',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contract.compact line 155 char 1',
                                     'Boolean',
                                     allowed_0)
        }
        if (!(typeof(expectedMasterActionNonce_0) === 'bigint' && expectedMasterActionNonce_0 >= 0n && expectedMasterActionNonce_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setBatcherAuthorization',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'contract.compact line 155 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedMasterActionNonce_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(batcherAuthId_0).concat(_descriptor_3.toValue(allowed_0).concat(_descriptor_0.toValue(expectedMasterActionNonce_0))),
            alignment: _descriptor_1.alignment().concat(_descriptor_3.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._setBatcherAuthorization_0(context,
                                                         partialProofData,
                                                         batcherAuthId_0,
                                                         allowed_0,
                                                         expectedMasterActionNonce_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      setProtocolFeeConfig: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`setProtocolFeeConfig: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const newProtocolFeeRecipientBytes_0 = args_1[1];
        const newProtocolFeeShareBps_0 = args_1[2];
        const expectedMasterActionNonce_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setProtocolFeeConfig',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 170 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(newProtocolFeeRecipientBytes_0.buffer instanceof ArrayBuffer && newProtocolFeeRecipientBytes_0.BYTES_PER_ELEMENT === 1 && newProtocolFeeRecipientBytes_0.length === 32)) {
          __compactRuntime.typeError('setProtocolFeeConfig',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 170 char 1',
                                     'Bytes<32>',
                                     newProtocolFeeRecipientBytes_0)
        }
        if (!(typeof(newProtocolFeeShareBps_0) === 'bigint' && newProtocolFeeShareBps_0 >= 0n && newProtocolFeeShareBps_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setProtocolFeeConfig',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contract.compact line 170 char 1',
                                     'Uint<0..18446744073709551616>',
                                     newProtocolFeeShareBps_0)
        }
        if (!(typeof(expectedMasterActionNonce_0) === 'bigint' && expectedMasterActionNonce_0 >= 0n && expectedMasterActionNonce_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('setProtocolFeeConfig',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'contract.compact line 170 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedMasterActionNonce_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(newProtocolFeeRecipientBytes_0).concat(_descriptor_0.toValue(newProtocolFeeShareBps_0).concat(_descriptor_0.toValue(expectedMasterActionNonce_0))),
            alignment: _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._setProtocolFeeConfig_0(context,
                                                      partialProofData,
                                                      newProtocolFeeRecipientBytes_0,
                                                      newProtocolFeeShareBps_0,
                                                      expectedMasterActionNonce_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      claimProtocolFees: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`claimProtocolFees: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const expectedMasterActionNonce_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claimProtocolFees',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 193 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(expectedMasterActionNonce_0) === 'bigint' && expectedMasterActionNonce_0 >= 0n && expectedMasterActionNonce_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('claimProtocolFees',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 193 char 1',
                                     'Uint<0..18446744073709551616>',
                                     expectedMasterActionNonce_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(expectedMasterActionNonce_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._claimProtocolFees_0(context,
                                                   partialProofData,
                                                   expectedMasterActionNonce_0);
        partialProofData.output = { value: _descriptor_11.toValue(result_0), alignment: _descriptor_11.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      depositLiquidity: (...args_1) => {
        if (args_1.length !== 5) {
          throw new __compactRuntime.CompactError(`depositLiquidity: expected 5 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const amountA_0 = args_1[1];
        const amountB_0 = args_1[2];
        const minLpOut_0 = args_1[3];
        const recipientBytes_0 = args_1[4];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('depositLiquidity',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 219 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(amountA_0) === 'bigint' && amountA_0 >= 0n && amountA_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('depositLiquidity',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 219 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amountA_0)
        }
        if (!(typeof(amountB_0) === 'bigint' && amountB_0 >= 0n && amountB_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('depositLiquidity',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contract.compact line 219 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amountB_0)
        }
        if (!(typeof(minLpOut_0) === 'bigint' && minLpOut_0 >= 0n && minLpOut_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('depositLiquidity',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'contract.compact line 219 char 1',
                                     'Uint<0..18446744073709551616>',
                                     minLpOut_0)
        }
        if (!(recipientBytes_0.buffer instanceof ArrayBuffer && recipientBytes_0.BYTES_PER_ELEMENT === 1 && recipientBytes_0.length === 32)) {
          __compactRuntime.typeError('depositLiquidity',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'contract.compact line 219 char 1',
                                     'Bytes<32>',
                                     recipientBytes_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(amountA_0).concat(_descriptor_0.toValue(amountB_0).concat(_descriptor_0.toValue(minLpOut_0).concat(_descriptor_1.toValue(recipientBytes_0)))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment())))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._depositLiquidity_0(context,
                                                  partialProofData,
                                                  amountA_0,
                                                  amountB_0,
                                                  minLpOut_0,
                                                  recipientBytes_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      depositOrder: (...args_1) => {
        if (args_1.length !== 8) {
          throw new __compactRuntime.CompactError(`depositOrder: expected 8 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        const direction_0 = args_1[2];
        const amountIn_0 = args_1[3];
        const minAmountOut_0 = args_1[4];
        const recipientBytes_0 = args_1[5];
        const ownerBytes_0 = args_1[6];
        const deadline_0 = args_1[7];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        if (!(typeof(direction_0) === 'number' && direction_0 >= 0 && direction_0 <= 3)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'Enum<Direction, AtoB, BtoA, LiquidityAdd, LiquidityRemove>',
                                     direction_0)
        }
        if (!(typeof(amountIn_0) === 'bigint' && amountIn_0 >= 0n && amountIn_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amountIn_0)
        }
        if (!(typeof(minAmountOut_0) === 'bigint' && minAmountOut_0 >= 0n && minAmountOut_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'Uint<0..18446744073709551616>',
                                     minAmountOut_0)
        }
        if (!(recipientBytes_0.buffer instanceof ArrayBuffer && recipientBytes_0.BYTES_PER_ELEMENT === 1 && recipientBytes_0.length === 32)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'Bytes<32>',
                                     recipientBytes_0)
        }
        if (!(ownerBytes_0.buffer instanceof ArrayBuffer && ownerBytes_0.BYTES_PER_ELEMENT === 1 && ownerBytes_0.length === 32)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'Bytes<32>',
                                     ownerBytes_0)
        }
        if (!(typeof(deadline_0) === 'bigint' && deadline_0 >= 0n && deadline_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('depositOrder',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'contract.compact line 277 char 1',
                                     'Uint<0..18446744073709551616>',
                                     deadline_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(orderId_0).concat(_descriptor_9.toValue(direction_0).concat(_descriptor_0.toValue(amountIn_0).concat(_descriptor_0.toValue(minAmountOut_0).concat(_descriptor_1.toValue(recipientBytes_0).concat(_descriptor_1.toValue(ownerBytes_0).concat(_descriptor_0.toValue(deadline_0))))))),
            alignment: _descriptor_1.alignment().concat(_descriptor_9.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment()))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._depositOrder_0(context,
                                              partialProofData,
                                              orderId_0,
                                              direction_0,
                                              amountIn_0,
                                              minAmountOut_0,
                                              recipientBytes_0,
                                              ownerBytes_0,
                                              deadline_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      cancelOrder: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`cancelOrder: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('cancelOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 341 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('cancelOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 341 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(orderId_0),
            alignment: _descriptor_1.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._cancelOrder_0(context,
                                             partialProofData,
                                             orderId_0);
        partialProofData.output = { value: _descriptor_11.toValue(result_0), alignment: _descriptor_11.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      liquidityOrder: (...args_1) => {
        if (args_1.length !== 10) {
          throw new __compactRuntime.CompactError(`liquidityOrder: expected 10 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const liquidityId_0 = args_1[1];
        const direction_0 = args_1[2];
        const amountIn_0 = args_1[3];
        const amountAux_0 = args_1[4];
        const minAmountOut_0 = args_1[5];
        const recipientBytes_0 = args_1[6];
        const ownerBytes_0 = args_1[7];
        const deadline_0 = args_1[8];
        const creationTimeUpperBound_0 = args_1[9];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(liquidityId_0.buffer instanceof ArrayBuffer && liquidityId_0.BYTES_PER_ELEMENT === 1 && liquidityId_0.length === 32)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Bytes<32>',
                                     liquidityId_0)
        }
        if (!(typeof(direction_0) === 'number' && direction_0 >= 0 && direction_0 <= 3)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Enum<Direction, AtoB, BtoA, LiquidityAdd, LiquidityRemove>',
                                     direction_0)
        }
        if (!(typeof(amountIn_0) === 'bigint' && amountIn_0 >= 0n && amountIn_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amountIn_0)
        }
        if (!(typeof(amountAux_0) === 'bigint' && amountAux_0 >= 0n && amountAux_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Uint<0..18446744073709551616>',
                                     amountAux_0)
        }
        if (!(typeof(minAmountOut_0) === 'bigint' && minAmountOut_0 >= 0n && minAmountOut_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Uint<0..18446744073709551616>',
                                     minAmountOut_0)
        }
        if (!(recipientBytes_0.buffer instanceof ArrayBuffer && recipientBytes_0.BYTES_PER_ELEMENT === 1 && recipientBytes_0.length === 32)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Bytes<32>',
                                     recipientBytes_0)
        }
        if (!(ownerBytes_0.buffer instanceof ArrayBuffer && ownerBytes_0.BYTES_PER_ELEMENT === 1 && ownerBytes_0.length === 32)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Bytes<32>',
                                     ownerBytes_0)
        }
        if (!(typeof(deadline_0) === 'bigint' && deadline_0 >= 0n && deadline_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Uint<0..18446744073709551616>',
                                     deadline_0)
        }
        if (!(typeof(creationTimeUpperBound_0) === 'bigint' && creationTimeUpperBound_0 >= 0n && creationTimeUpperBound_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('liquidityOrder',
                                     'argument 9 (argument 10 as invoked from Typescript)',
                                     'contract.compact line 371 char 1',
                                     'Uint<0..18446744073709551616>',
                                     creationTimeUpperBound_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(liquidityId_0).concat(_descriptor_9.toValue(direction_0).concat(_descriptor_0.toValue(amountIn_0).concat(_descriptor_0.toValue(amountAux_0).concat(_descriptor_0.toValue(minAmountOut_0).concat(_descriptor_1.toValue(recipientBytes_0).concat(_descriptor_1.toValue(ownerBytes_0).concat(_descriptor_0.toValue(deadline_0).concat(_descriptor_0.toValue(creationTimeUpperBound_0))))))))),
            alignment: _descriptor_1.alignment().concat(_descriptor_9.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()))))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._liquidityOrder_0(context,
                                                partialProofData,
                                                liquidityId_0,
                                                direction_0,
                                                amountIn_0,
                                                amountAux_0,
                                                minAmountOut_0,
                                                recipientBytes_0,
                                                ownerBytes_0,
                                                deadline_0,
                                                creationTimeUpperBound_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      cancelLiquidityOrder: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`cancelLiquidityOrder: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const liquidityId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('cancelLiquidityOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 454 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(liquidityId_0.buffer instanceof ArrayBuffer && liquidityId_0.BYTES_PER_ELEMENT === 1 && liquidityId_0.length === 32)) {
          __compactRuntime.typeError('cancelLiquidityOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 454 char 1',
                                     'Bytes<32>',
                                     liquidityId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(liquidityId_0),
            alignment: _descriptor_1.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._cancelLiquidityOrder_0(context,
                                                      partialProofData,
                                                      liquidityId_0);
        partialProofData.output = { value: _descriptor_14.toValue(result_0), alignment: _descriptor_14.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      settleLiquidityOrder: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`settleLiquidityOrder: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const liquidityId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('settleLiquidityOrder',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 496 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(liquidityId_0.buffer instanceof ArrayBuffer && liquidityId_0.BYTES_PER_ELEMENT === 1 && liquidityId_0.length === 32)) {
          __compactRuntime.typeError('settleLiquidityOrder',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 496 char 1',
                                     'Bytes<32>',
                                     liquidityId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(liquidityId_0),
            alignment: _descriptor_1.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._settleLiquidityOrder_0(context,
                                                      partialProofData,
                                                      liquidityId_0);
        partialProofData.output = { value: _descriptor_14.toValue(result_0), alignment: _descriptor_14.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      settleOne: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`settleOne: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderId_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('settleOne',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 525 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(orderId_0.buffer instanceof ArrayBuffer && orderId_0.BYTES_PER_ELEMENT === 1 && orderId_0.length === 32)) {
          __compactRuntime.typeError('settleOne',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 525 char 1',
                                     'Bytes<32>',
                                     orderId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(orderId_0),
            alignment: _descriptor_1.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._settleOne_0(context, partialProofData, orderId_0);
        partialProofData.output = { value: _descriptor_11.toValue(result_0), alignment: _descriptor_11.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      settleBatchUpTo5: (...args_1) => {
        if (args_1.length !== 7) {
          throw new __compactRuntime.CompactError(`settleBatchUpTo5: expected 7 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const orderCount_0 = args_1[1];
        const orderIdA_0 = args_1[2];
        const orderIdB_0 = args_1[3];
        const orderIdC_0 = args_1[4];
        const orderIdD_0 = args_1[5];
        const orderIdE_0 = args_1[6];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('settleBatchUpTo5',
                                     'argument 1 (as invoked from Typescript)',
                                     'contract.compact line 533 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(orderCount_0) === 'bigint' && orderCount_0 >= 0n && orderCount_0 <= 255n)) {
          __compactRuntime.typeError('settleBatchUpTo5',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contract.compact line 533 char 1',
                                     'Uint<0..256>',
                                     orderCount_0)
        }
        if (!(orderIdA_0.buffer instanceof ArrayBuffer && orderIdA_0.BYTES_PER_ELEMENT === 1 && orderIdA_0.length === 32)) {
          __compactRuntime.typeError('settleBatchUpTo5',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contract.compact line 533 char 1',
                                     'Bytes<32>',
                                     orderIdA_0)
        }
        if (!(orderIdB_0.buffer instanceof ArrayBuffer && orderIdB_0.BYTES_PER_ELEMENT === 1 && orderIdB_0.length === 32)) {
          __compactRuntime.typeError('settleBatchUpTo5',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'contract.compact line 533 char 1',
                                     'Bytes<32>',
                                     orderIdB_0)
        }
        if (!(orderIdC_0.buffer instanceof ArrayBuffer && orderIdC_0.BYTES_PER_ELEMENT === 1 && orderIdC_0.length === 32)) {
          __compactRuntime.typeError('settleBatchUpTo5',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'contract.compact line 533 char 1',
                                     'Bytes<32>',
                                     orderIdC_0)
        }
        if (!(orderIdD_0.buffer instanceof ArrayBuffer && orderIdD_0.BYTES_PER_ELEMENT === 1 && orderIdD_0.length === 32)) {
          __compactRuntime.typeError('settleBatchUpTo5',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'contract.compact line 533 char 1',
                                     'Bytes<32>',
                                     orderIdD_0)
        }
        if (!(orderIdE_0.buffer instanceof ArrayBuffer && orderIdE_0.BYTES_PER_ELEMENT === 1 && orderIdE_0.length === 32)) {
          __compactRuntime.typeError('settleBatchUpTo5',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'contract.compact line 533 char 1',
                                     'Bytes<32>',
                                     orderIdE_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(orderCount_0).concat(_descriptor_1.toValue(orderIdA_0).concat(_descriptor_1.toValue(orderIdB_0).concat(_descriptor_1.toValue(orderIdC_0).concat(_descriptor_1.toValue(orderIdD_0).concat(_descriptor_1.toValue(orderIdE_0)))))),
            alignment: _descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._settleBatchUpTo5_0(context,
                                                  partialProofData,
                                                  orderCount_0,
                                                  orderIdA_0,
                                                  orderIdB_0,
                                                  orderIdC_0,
                                                  orderIdD_0,
                                                  orderIdE_0);
        partialProofData.output = { value: _descriptor_12.toValue(result_0), alignment: _descriptor_12.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      setBatcherAuthorization: this.circuits.setBatcherAuthorization,
      setProtocolFeeConfig: this.circuits.setProtocolFeeConfig,
      claimProtocolFees: this.circuits.claimProtocolFees,
      depositLiquidity: this.circuits.depositLiquidity,
      depositOrder: this.circuits.depositOrder,
      cancelOrder: this.circuits.cancelOrder,
      liquidityOrder: this.circuits.liquidityOrder,
      cancelLiquidityOrder: this.circuits.cancelLiquidityOrder,
      settleLiquidityOrder: this.circuits.settleLiquidityOrder,
      settleOne: this.circuits.settleOne,
      settleBatchUpTo5: this.circuits.settleBatchUpTo5
    };
    this.provableCircuits = {
      setBatcherAuthorization: this.circuits.setBatcherAuthorization,
      setProtocolFeeConfig: this.circuits.setProtocolFeeConfig,
      claimProtocolFees: this.circuits.claimProtocolFees,
      depositLiquidity: this.circuits.depositLiquidity,
      depositOrder: this.circuits.depositOrder,
      cancelOrder: this.circuits.cancelOrder,
      liquidityOrder: this.circuits.liquidityOrder,
      cancelLiquidityOrder: this.circuits.cancelLiquidityOrder,
      settleLiquidityOrder: this.circuits.settleLiquidityOrder,
      settleOne: this.circuits.settleOne,
      settleBatchUpTo5: this.circuits.settleBatchUpTo5
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 9) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 9 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const tokenTypeA__0 = args_0[1];
    const tokenTypeB__0 = args_0[2];
    const lpFeeBps__0 = args_0[3];
    const masterAuthId__0 = args_0[4];
    const initialBatcherAuthId__0 = args_0[5];
    const protocolFeeRecipientBytes__0 = args_0[6];
    const orderBondTokenType__0 = args_0[7];
    const orderBondAmount__0 = args_0[8];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(tokenTypeA__0.buffer instanceof ArrayBuffer && tokenTypeA__0.BYTES_PER_ELEMENT === 1 && tokenTypeA__0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Bytes<32>',
                                 tokenTypeA__0)
    }
    if (!(tokenTypeB__0.buffer instanceof ArrayBuffer && tokenTypeB__0.BYTES_PER_ELEMENT === 1 && tokenTypeB__0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Bytes<32>',
                                 tokenTypeB__0)
    }
    if (!(typeof(lpFeeBps__0) === 'bigint' && lpFeeBps__0 >= 0n && lpFeeBps__0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Uint<0..18446744073709551616>',
                                 lpFeeBps__0)
    }
    if (!(masterAuthId__0.buffer instanceof ArrayBuffer && masterAuthId__0.BYTES_PER_ELEMENT === 1 && masterAuthId__0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 4 (argument 5 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Bytes<32>',
                                 masterAuthId__0)
    }
    if (!(initialBatcherAuthId__0.buffer instanceof ArrayBuffer && initialBatcherAuthId__0.BYTES_PER_ELEMENT === 1 && initialBatcherAuthId__0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 5 (argument 6 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Bytes<32>',
                                 initialBatcherAuthId__0)
    }
    if (!(protocolFeeRecipientBytes__0.buffer instanceof ArrayBuffer && protocolFeeRecipientBytes__0.BYTES_PER_ELEMENT === 1 && protocolFeeRecipientBytes__0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 6 (argument 7 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Bytes<32>',
                                 protocolFeeRecipientBytes__0)
    }
    if (!(orderBondTokenType__0.buffer instanceof ArrayBuffer && orderBondTokenType__0.BYTES_PER_ELEMENT === 1 && orderBondTokenType__0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 7 (argument 8 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Bytes<32>',
                                 orderBondTokenType__0)
    }
    if (!(typeof(orderBondAmount__0) === 'bigint' && orderBondAmount__0 >= 0n && orderBondAmount__0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 8 (argument 9 as invoked from Typescript)',
                                 'contract.compact line 103 char 1',
                                 'Uint<0..18446744073709551616>',
                                 orderBondAmount__0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    let stateValue_2 = __compactRuntime.StateValue.newArray();
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_2 = stateValue_2.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_2);
    let stateValue_1 = __compactRuntime.StateValue.newArray();
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_1 = stateValue_1.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(stateValue_1);
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('setBatcherAuthorization', new __compactRuntime.ContractOperation());
    state_0.setOperation('setProtocolFeeConfig', new __compactRuntime.ContractOperation());
    state_0.setOperation('claimProtocolFees', new __compactRuntime.ContractOperation());
    state_0.setOperation('depositLiquidity', new __compactRuntime.ContractOperation());
    state_0.setOperation('depositOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('cancelOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('liquidityOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('cancelLiquidityOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('settleLiquidityOrder', new __compactRuntime.ContractOperation());
    state_0.setOperation('settleOne', new __compactRuntime.ContractOperation());
    state_0.setOperation('settleBatchUpTo5', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(4n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(11n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(12n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(13n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(14n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const poolTokenA_0 = tokenTypeA__0;
    const poolTokenB_0 = tokenTypeB__0;
    const poolLpFeeBps_0 = lpFeeBps__0;
    const masterAuth_0 = masterAuthId__0;
    const initialBatcherAuth_0 = initialBatcherAuthId__0;
    const protocolRecipient_0 = protocolFeeRecipientBytes__0;
    const bondTokenType_0 = orderBondTokenType__0;
    const bondAmount_0 = orderBondAmount__0;
    const domainSep_0 = new Uint8Array([66, 83, 86, 51, 51, 95, 76, 80, 95, 68, 79, 77, 65, 73, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const expectedLpType_0 = this._tokenType_0(domainSep_0,
                                               _descriptor_15.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                          partialProofData,
                                                                                                          [
                                                                                                           { dup: { n: 2 } },
                                                                                                           { idx: { cached: true,
                                                                                                                    pushPath: false,
                                                                                                                    path: [
                                                                                                                           { tag: 'value',
                                                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                                           { popeq: { cached: true,
                                                                                                                      result: undefined } }]).value));
    __compactRuntime.assert(!this._equal_0(poolTokenA_0, poolTokenB_0), 'E_PAIR');
    __compactRuntime.assert(!this._equal_1(expectedLpType_0, poolTokenA_0),
                            'E_LP_A');
    __compactRuntime.assert(!this._equal_2(expectedLpType_0, poolTokenB_0),
                            'E_LP_B');
    __compactRuntime.assert(!this._equal_3(expectedLpType_0, bondTokenType_0),
                            'E_LP_BOND');
    __compactRuntime.assert(bondAmount_0 > 0n, 'E_BOND_0');
    const maxBatchBondRefund_0 = bondAmount_0 * 5n;
    __compactRuntime.assert(maxBatchBondRefund_0 <= this.__maxU64_0(),
                            'E_BOND_MAX');
    __compactRuntime.assert(poolLpFeeBps_0 >= this.__minLpFeeBps_0(),
                            'E_LP_FEE_MIN');
    __compactRuntime.assert(poolLpFeeBps_0 <= this.__maxLpFeeBps_0(),
                            'E_LP_FEE_MAX');
    __compactRuntime.assert(!this._equal_4(masterAuth_0, new Uint8Array(32)),
                            'E_MASTER_0');
    __compactRuntime.assert(!this._equal_5(initialBatcherAuth_0,
                                           new Uint8Array(32)),
                            'E_BATCHER_0');
    __compactRuntime.assert(!this._equal_6(protocolRecipient_0,
                                           new Uint8Array(32)),
                            'E_PROTOCOL_0');
    const tmp_0 = this.__callerDeployerAuthId_0(context, partialProofData);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(14n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(masterAuth_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(poolTokenA_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(poolTokenB_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(0n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(domainSep_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(poolLpFeeBps_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(1n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(bondTokenType_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(2n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(bondAmount_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(protocolRecipient_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this.__defaultProtocolFeeShareBps_0();
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(4n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_2 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(13n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this.__setBatcherAuthorizationInternal_0(context,
                                             partialProofData,
                                             initialBatcherAuth_0,
                                             true);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _tokenType_0(domain_sep_0, contractAddress_0) {
    return this._persistentCommit_0([domain_sep_0, contractAddress_0.bytes],
                                    new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 100, 101, 114, 105, 118, 101, 95, 116, 111, 107, 101, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  _blockTimeLt_0(context, partialProofData, time_0) {
    return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(2n),
                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(time_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _blockTimeGte_0(context, partialProofData, time_0) {
    return !this._blockTimeLt_0(context, partialProofData, time_0);
  }
  _blockTimeGt_0(context, partialProofData, time_0) {
    return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(time_0),
                                                                                                                             alignment: _descriptor_0.alignment() }).encode() } },
                                                                      { dup: { n: 3 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(2n),
                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _blockTimeLte_0(context, partialProofData, time_0) {
    return !this._blockTimeGt_0(context, partialProofData, time_0);
  }
  _mintUnshieldedToken_0(context,
                         partialProofData,
                         domainSep_0,
                         amount_0,
                         recipient_0)
  {
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(5n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(domainSep_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(amount_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    const color_0 = this._tokenType_0(domainSep_0,
                                      _descriptor_15.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                 partialProofData,
                                                                                                 [
                                                                                                  { dup: { n: 2 } },
                                                                                                  { idx: { cached: true,
                                                                                                           pushPath: false,
                                                                                                           path: [
                                                                                                                  { tag: 'value',
                                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                                  { popeq: { cached: true,
                                                                                                             result: undefined } }]).value));
    const tmp_0 = this._left_0(color_0);
    const tmp_1 = amount_0;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(8n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_19.toValue(tmp_0),
                                                                                                alignment: _descriptor_19.alignment() },
                                                                                              { value: _descriptor_20.toValue(recipient_0),
                                                                                                alignment: _descriptor_20.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_1),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (recipient_0.is_left
        &&
        this._equal_7(recipient_0.left.bytes,
                      _descriptor_15.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_0(color_0);
      const tmp_3 = amount_0;
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(6n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(tmp_2),
                                                                                                alignment: _descriptor_19.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_3),
                                                                                                alignment: _descriptor_4.alignment() }).encode() } },
                                         { swap: { n: 0 } },
                                         'neg',
                                         { branch: { skip: 4 } },
                                         { dup: { n: 2 } },
                                         { dup: { n: 2 } },
                                         { idx: { cached: true,
                                                  pushPath: false,
                                                  path: [ { tag: 'stack' }] } },
                                         'add',
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return color_0;
  }
  _sendUnshielded_0(context, partialProofData, color_0, amount_0, recipient_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(7n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(tmp_0),
                                                                                              alignment: _descriptor_19.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(amount_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    const tmp_1 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(8n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_19.toValue(tmp_1),
                                                                                                alignment: _descriptor_19.alignment() },
                                                                                              { value: _descriptor_20.toValue(recipient_0),
                                                                                                alignment: _descriptor_20.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(amount_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (recipient_0.is_left
        &&
        this._equal_8(recipient_0.left.bytes,
                      _descriptor_15.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_0(color_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(6n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(tmp_2),
                                                                                                alignment: _descriptor_19.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(amount_0),
                                                                                                alignment: _descriptor_4.alignment() }).encode() } },
                                         { swap: { n: 0 } },
                                         'neg',
                                         { branch: { skip: 4 } },
                                         { dup: { n: 2 } },
                                         { dup: { n: 2 } },
                                         { idx: { cached: true,
                                                  pushPath: false,
                                                  path: [ { tag: 'stack' }] } },
                                         'add',
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return [];
  }
  _receiveUnshielded_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(6n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(tmp_0),
                                                                                              alignment: _descriptor_19.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(amount_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _unshieldedBalanceLt_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(5n),
                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                      { dup: { n: 0 } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(tmp_0),
                                                                                                                             alignment: _descriptor_19.alignment() }).encode() } },
                                                                      'member',
                                                                      { branch: { skip: 3 } },
                                                                      'pop',
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(0n),
                                                                                                                             alignment: _descriptor_4.alignment() }).encode() } },
                                                                      { jmp: { skip: 1 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_19.toValue(tmp_0),
                                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(amount_0),
                                                                                                                             alignment: _descriptor_4.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  _unshieldedBalanceGte_0(context, partialProofData, color_0, amount_0) {
    return !this._unshieldedBalanceLt_0(context,
                                        partialProofData,
                                        color_0,
                                        amount_0);
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_18, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_17, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_17,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _wit_divU128ByU64_0(context, partialProofData, dividend_0, divisor_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.wit_divU128ByU64(witnessContext_0,
                                                                           dividend_0,
                                                                           divisor_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.quotient) === 'bigint' && result_0.quotient >= 0n && result_0.quotient <= 18446744073709551615n && typeof(result_0.remainder) === 'bigint' && result_0.remainder >= 0n && result_0.remainder <= 18446744073709551615n)) {
      __compactRuntime.typeError('wit_divU128ByU64',
                                 'return value',
                                 'contract.compact line 69 char 1',
                                 'struct DivResultU128ByU64<quotient: Uint<0..18446744073709551616>, remainder: Uint<0..18446744073709551616>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_16.toValue(result_0),
      alignment: _descriptor_16.alignment()
    });
    return result_0;
  }
  _wit_sqrtU128_0(context, partialProofData, value_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.wit_sqrtU128(witnessContext_0,
                                                                       value_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('wit_sqrtU128',
                                 'return value',
                                 'contract.compact line 70 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _localSk_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localSk(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localSk',
                                 'return value',
                                 'contract.compact line 71 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _cancelSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.cancelSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('cancelSecret',
                                 'return value',
                                 'contract.compact line 72 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _setBatcherAuthorization_0(context,
                             partialProofData,
                             batcherAuthId_0,
                             allowed_0,
                             expectedMasterActionNonce_0)
  {
    this.__assertMasterWallet_0(context, partialProofData);
    this.__assertMasterActionNonce_0(context,
                                     partialProofData,
                                     expectedMasterActionNonce_0);
    const batcherKey_0 = batcherAuthId_0;
    __compactRuntime.assert(!this._equal_9(batcherKey_0, new Uint8Array(32)),
                            'E_BATCHER_0');
    this.__setBatcherAuthorizationInternal_0(context,
                                             partialProofData,
                                             batcherKey_0,
                                             allowed_0);
    const tmp_0 = this.__addU64_0(expectedMasterActionNonce_0, 1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(13n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _setProtocolFeeConfig_0(context,
                          partialProofData,
                          newProtocolFeeRecipientBytes_0,
                          newProtocolFeeShareBps_0,
                          expectedMasterActionNonce_0)
  {
    this.__assertMasterWallet_0(context, partialProofData);
    this.__assertMasterActionNonce_0(context,
                                     partialProofData,
                                     expectedMasterActionNonce_0);
    const nextRecipient_0 = newProtocolFeeRecipientBytes_0;
    const nextFeeShareBps_0 = newProtocolFeeShareBps_0;
    __compactRuntime.assert(!this._equal_10(nextRecipient_0, new Uint8Array(32)),
                            'E_PROTOCOL_0');
    __compactRuntime.assert(nextFeeShareBps_0
                            <=
                            this.__maxProtocolFeeShareBps_0(),
                            'E_PROTOCOL_FEE');
    if (!this._equal_11(nextRecipient_0,
                        _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(1n),
                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(3n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value)))
    {
      __compactRuntime.assert(this._equal_12(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                       partialProofData,
                                                                                                       [
                                                                                                        { dup: { n: 0 } },
                                                                                                        { idx: { cached: false,
                                                                                                                 pushPath: false,
                                                                                                                 path: [
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(5n),
                                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                                        { popeq: { cached: false,
                                                                                                                   result: undefined } }]).value),
                                             0n)
                              &&
                              this._equal_13(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                       partialProofData,
                                                                                                       [
                                                                                                        { dup: { n: 0 } },
                                                                                                        { idx: { cached: false,
                                                                                                                 pushPath: false,
                                                                                                                 path: [
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(6n),
                                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                                        { popeq: { cached: false,
                                                                                                                   result: undefined } }]).value),
                                             0n),
                              'E_CLAIM_FIRST');
    }
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(3n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(nextRecipient_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(4n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nextFeeShareBps_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = this.__addU64_0(expectedMasterActionNonce_0, 1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(13n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _claimProtocolFees_0(context, partialProofData, expectedMasterActionNonce_0) {
    this.__assertMasterWallet_0(context, partialProofData);
    this.__assertMasterActionNonce_0(context,
                                     partialProofData,
                                     expectedMasterActionNonce_0);
    const amountA_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(1n),
                                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(5n),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const amountB_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(1n),
                                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_2.toValue(6n),
                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(amountA_0 > 0n || amountB_0 > 0n, 'E_NO_FEES');
    this.__assertAggregateOutputCoverage_0(context, partialProofData, 0n, 0n, 0n);
    const tmp_0 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 0n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (amountA_0 > 0n) {
      this.__sendToUser_0(context,
                          partialProofData,
                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                    partialProofData,
                                                                                    [
                                                                                     { dup: { n: 0 } },
                                                                                     { idx: { cached: false,
                                                                                              pushPath: false,
                                                                                              path: [
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(0n),
                                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(1n),
                                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                                     { popeq: { cached: false,
                                                                                                result: undefined } }]).value),
                          amountA_0,
                          this.__protocolFeeRecipient_0(context,
                                                        partialProofData));
    }
    if (amountB_0 > 0n) {
      this.__sendToUser_0(context,
                          partialProofData,
                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                    partialProofData,
                                                                                    [
                                                                                     { dup: { n: 0 } },
                                                                                     { idx: { cached: false,
                                                                                              pushPath: false,
                                                                                              path: [
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(0n),
                                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(2n),
                                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                                     { popeq: { cached: false,
                                                                                                result: undefined } }]).value),
                          amountB_0,
                          this.__protocolFeeRecipient_0(context,
                                                        partialProofData));
    }
    const tmp_2 = this.__addU64_0(expectedMasterActionNonce_0, 1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(13n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return { executed: false, amountIn: amountA_0, amountOut: amountB_0 };
  }
  _depositLiquidity_0(context,
                      partialProofData,
                      amountA_0,
                      amountB_0,
                      minLpOut_0,
                      recipientBytes_0)
  {
    __compactRuntime.assert(this._equal_14(this.__callerDeployerAuthId_0(context,
                                                                         partialProofData),
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(14n),
                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'E_DEPLOYER');
    __compactRuntime.assert(amountA_0 > 0n, 'E_A_ZERO');
    __compactRuntime.assert(amountB_0 > 0n, 'E_B_ZERO');
    __compactRuntime.assert(!this._equal_15(recipientBytes_0, new Uint8Array(32)),
                            'E_RECIPIENT_0');
    __compactRuntime.assert(this._equal_16(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(8n),
                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value),
                                           0n),
                            'E_BOOTSTRAP_ONLY');
    const actualLpType_0 = this._tokenType_0(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                       partialProofData,
                                                                                                       [
                                                                                                        { dup: { n: 0 } },
                                                                                                        { idx: { cached: false,
                                                                                                                 pushPath: false,
                                                                                                                 path: [
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(3n),
                                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                                        { popeq: { cached: false,
                                                                                                                   result: undefined } }]).value),
                                             _descriptor_15.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                        partialProofData,
                                                                                                        [
                                                                                                         { dup: { n: 2 } },
                                                                                                         { idx: { cached: true,
                                                                                                                  pushPath: false,
                                                                                                                  path: [
                                                                                                                         { tag: 'value',
                                                                                                                           value: { value: _descriptor_2.toValue(0n),
                                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                                         { popeq: { cached: true,
                                                                                                                    result: undefined } }]).value));
    __compactRuntime.assert(!this._equal_17(actualLpType_0,
                                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value)),
                            'E_LP_A');
    __compactRuntime.assert(!this._equal_18(actualLpType_0,
                                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(2n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value)),
                            'E_LP_B');
    __compactRuntime.assert(!this._equal_19(actualLpType_0,
                                            this.__orderBondColor_0(context,
                                                                    partialProofData)),
                            'E_LP_BOND');
    const deltaA_0 = amountA_0;
    const deltaB_0 = amountB_0;
    const minLp_0 = minLpOut_0;
    const providerRecipient_0 = { bytes: recipientBytes_0 };
    this.__assertIncomingOrderAmountsFitRuntime_0(context,
                                                  partialProofData,
                                                  deltaA_0,
                                                  deltaB_0,
                                                  this.__orderBondAmount_0(context,
                                                                           partialProofData));
    this.__receiveIfPositive_0(context,
                               partialProofData,
                               _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                                          { popeq: { cached: false,
                                                                                                     result: undefined } }]).value),
                               deltaA_0);
    this.__receiveIfPositive_0(context,
                               partialProofData,
                               _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                                          { popeq: { cached: false,
                                                                                                     result: undefined } }]).value),
                               deltaB_0);
    const product_0 = deltaA_0 * deltaB_0;
    const sqrtProduct_0 = this.__sqrtU128Floor_0(context,
                                                 partialProofData,
                                                 product_0);
    const minLiquidity_0 = this.__minimumLiquidity_0();
    __compactRuntime.assert(sqrtProduct_0 > minLiquidity_0, 'E_INIT_LIQ');
    const mintedToProvider_0 = this.__subU64_0(sqrtProduct_0, minLiquidity_0);
    __compactRuntime.assert(mintedToProvider_0 >= minLp_0, 'E_LP_OUT');
    const tmp_0 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(9n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  deltaA_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  deltaB_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this.__mintLpToUser_0(context,
                          partialProofData,
                          minLiquidity_0,
                          this.__burnUserAddress_0());
    this.__mintLpToUser_0(context,
                          partialProofData,
                          mintedToProvider_0,
                          providerRecipient_0);
    __compactRuntime.assert(this._equal_20(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(7n),
                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value),
                                           actualLpType_0),
                            'E_LP_IDENTITY');
    return mintedToProvider_0;
  }
  _depositOrder_0(context,
                  partialProofData,
                  orderId_0,
                  direction_0,
                  amountIn_0,
                  minAmountOut_0,
                  recipientBytes_0,
                  ownerBytes_0,
                  deadline_0)
  {
    __compactRuntime.assert(!this.__isZeroBytes32_0(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                              partialProofData,
                                                                                                              [
                                                                                                               { dup: { n: 0 } },
                                                                                                               { idx: { cached: false,
                                                                                                                        pushPath: false,
                                                                                                                        path: [
                                                                                                                               { tag: 'value',
                                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                                               { tag: 'value',
                                                                                                                                 value: { value: _descriptor_2.toValue(7n),
                                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                                               { popeq: { cached: false,
                                                                                                                          result: undefined } }]).value)),
                            'E_POOL_0');
    const key_0 = orderId_0;
    __compactRuntime.assert(!this._equal_21(key_0, new Uint8Array(32)),
                            'E_ORDER_0');
    __compactRuntime.assert(amountIn_0 > 0n, 'E_AMOUNT_0');
    __compactRuntime.assert(amountIn_0 >= this.__minSwapAmount_0(),
                            'E_AMOUNT_MIN');
    __compactRuntime.assert(minAmountOut_0 > 0n, 'E_MIN_OUT_0');
    __compactRuntime.assert(!this._equal_22(recipientBytes_0, new Uint8Array(32)),
                            'E_RECIPIENT_0');
    __compactRuntime.assert(!this._equal_23(ownerBytes_0, new Uint8Array(32)),
                            'E_OWNER_0');
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(11n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'E_ORDER_EXISTS');
    const expiry_0 = deadline_0;
    this.__assertLiveDeadline_0(context, partialProofData, expiry_0);
    this.__assertMaxOrderDeadline_0(context, partialProofData, expiry_0);
    const grossAmountIn_0 = amountIn_0;
    const orderDirection_0 = direction_0;
    const bondAmount_0 = this.__orderBondAmount_0(context, partialProofData);
    __compactRuntime.assert(orderDirection_0 === 0 || orderDirection_0 === 1,
                            'E_SWAP_DIR');
    const effectiveAmountIn_0 = this.__effectiveAmountIn_0(context,
                                                           partialProofData,
                                                           grossAmountIn_0);
    __compactRuntime.assert(effectiveAmountIn_0 > 0n, 'E_TRADE_SMALL');
    const protocolFee_0 = this.__protocolFeeForAmount_0(context,
                                                        partialProofData,
                                                        grossAmountIn_0);
    if (orderDirection_0 === 0) {
      this.__assertIncomingOrderAmountsFitRuntime_0(context,
                                                    partialProofData,
                                                    grossAmountIn_0,
                                                    0n,
                                                    bondAmount_0);
      this.__receiveTokenAndBondInputs_0(context,
                                         partialProofData,
                                         grossAmountIn_0,
                                         0n,
                                         bondAmount_0);
    } else {
      this.__assertIncomingOrderAmountsFitRuntime_0(context,
                                                    partialProofData,
                                                    0n,
                                                    grossAmountIn_0,
                                                    bondAmount_0);
      this.__receiveTokenAndBondInputs_0(context,
                                         partialProofData,
                                         0n,
                                         grossAmountIn_0,
                                         bondAmount_0);
    }
    const order_0 = { cancelCommitment:
                        this.__cancelCommitment_0(context,
                                                  partialProofData,
                                                  key_0),
                      owner: { bytes: ownerBytes_0 },
                      recipient: { bytes: recipientBytes_0 },
                      direction: orderDirection_0,
                      amountIn: grossAmountIn_0,
                      amountAux: protocolFee_0,
                      minAmountOut: minAmountOut_0,
                      deadline: expiry_0,
                      publicSettleAfter: 0n };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(order_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _cancelOrder_0(context, partialProofData, orderId_0) {
    const key_0 = orderId_0;
    __compactRuntime.assert(!this._equal_24(key_0, new Uint8Array(32)),
                            'E_ORDER_0');
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(11n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'E_ORDER_MISSING');
    const order_0 = _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(11n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(key_0),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const direction_0 = order_0.direction;
    this.__assertCancelSecretOrExpired_0(context,
                                         partialProofData,
                                         order_0.cancelCommitment,
                                         key_0,
                                         order_0.deadline);
    __compactRuntime.assert(direction_0 === 0 || direction_0 === 1, 'E_NOT_SWAP');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    const amountIn_0 = order_0.amountIn;
    const owner_0 = order_0.owner;
    if (direction_0 === 0) {
      this.__sendSingleTokenOutputAndBond_0(context,
                                            partialProofData,
                                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value),
                                            amountIn_0,
                                            owner_0,
                                            owner_0,
                                            this.__orderBondAmount_0(context,
                                                                     partialProofData));
    } else {
      this.__sendSingleTokenOutputAndBond_0(context,
                                            partialProofData,
                                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(2n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value),
                                            amountIn_0,
                                            owner_0,
                                            owner_0,
                                            this.__orderBondAmount_0(context,
                                                                     partialProofData));
    }
    return { executed: false, amountIn: amountIn_0, amountOut: 0n };
  }
  _liquidityOrder_0(context,
                    partialProofData,
                    liquidityId_0,
                    direction_0,
                    amountIn_0,
                    amountAux_0,
                    minAmountOut_0,
                    recipientBytes_0,
                    ownerBytes_0,
                    deadline_0,
                    creationTimeUpperBound_0)
  {
    __compactRuntime.assert(!this.__isZeroBytes32_0(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                              partialProofData,
                                                                                                              [
                                                                                                               { dup: { n: 0 } },
                                                                                                               { idx: { cached: false,
                                                                                                                        pushPath: false,
                                                                                                                        path: [
                                                                                                                               { tag: 'value',
                                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                                               { tag: 'value',
                                                                                                                                 value: { value: _descriptor_2.toValue(7n),
                                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                                               { popeq: { cached: false,
                                                                                                                          result: undefined } }]).value)),
                            'E_POOL_0');
    const key_0 = liquidityId_0;
    const orderDirection_0 = direction_0;
    __compactRuntime.assert(!this._equal_25(key_0, new Uint8Array(32)),
                            'E_LIQ_0');
    __compactRuntime.assert(!this._equal_26(recipientBytes_0, new Uint8Array(32)),
                            'E_RECIPIENT_0');
    __compactRuntime.assert(!this._equal_27(ownerBytes_0, new Uint8Array(32)),
                            'E_OWNER_0');
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(11n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'E_LIQ_EXISTS');
    __compactRuntime.assert(orderDirection_0 === 2 || orderDirection_0 === 3,
                            'E_LIQ_DIR');
    const expiry_0 = deadline_0;
    this.__assertLiveDeadline_0(context, partialProofData, expiry_0);
    const creationUpper_0 = creationTimeUpperBound_0;
    __compactRuntime.assert(this._blockTimeLte_0(context,
                                                 partialProofData,
                                                 creationUpper_0),
                            'E_LIQ_CREATION_PAST');
    __compactRuntime.assert(this._blockTimeGte_0(context,
                                                 partialProofData,
                                                 this.__subU64_0(creationUpper_0,
                                                                 300n)),
                            'E_LIQ_CREATION_FUTURE');
    const publicAfter_0 = this.__addU64_0(creationUpper_0, 2592061n);
    __compactRuntime.assert(expiry_0 >= this.__addU64_0(publicAfter_0, 86400n),
                            'E_LIQ_PUBLIC_WINDOW');
    this.__assertMaxLiquidityOrderDeadline_0(context, partialProofData, expiry_0);
    const primaryAmount_0 = amountIn_0;
    const auxAmount_0 = amountAux_0;
    const minOut_0 = minAmountOut_0;
    const bondAmount_0 = this.__orderBondAmount_0(context, partialProofData);
    if (orderDirection_0 === 2) {
      __compactRuntime.assert(primaryAmount_0 > 0n, 'E_A_ZERO');
      __compactRuntime.assert(auxAmount_0 > 0n, 'E_B_ZERO');
      __compactRuntime.assert(minOut_0 > 0n, 'E_LP_OUT_0');
      this.__assertIncomingOrderAmountsFitRuntime_0(context,
                                                    partialProofData,
                                                    primaryAmount_0,
                                                    auxAmount_0,
                                                    bondAmount_0);
      this.__receiveTokenAndBondInputs_0(context,
                                         partialProofData,
                                         primaryAmount_0,
                                         auxAmount_0,
                                         bondAmount_0);
    } else {
      __compactRuntime.assert(!this.__isZeroBytes32_0(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                partialProofData,
                                                                                                                [
                                                                                                                 { dup: { n: 0 } },
                                                                                                                 { idx: { cached: false,
                                                                                                                          pushPath: false,
                                                                                                                          path: [
                                                                                                                                 { tag: 'value',
                                                                                                                                   value: { value: _descriptor_2.toValue(1n),
                                                                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                                                                 { tag: 'value',
                                                                                                                                   value: { value: _descriptor_2.toValue(7n),
                                                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                                                 { popeq: { cached: false,
                                                                                                                            result: undefined } }]).value)),
                              'E_LP_TYPE_0');
      __compactRuntime.assert(primaryAmount_0 > 0n, 'E_LP_AMOUNT_0');
      this.__receiveIfPositive_0(context,
                                 partialProofData,
                                 _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                           partialProofData,
                                                                                           [
                                                                                            { dup: { n: 0 } },
                                                                                            { idx: { cached: false,
                                                                                                     pushPath: false,
                                                                                                     path: [
                                                                                                            { tag: 'value',
                                                                                                              value: { value: _descriptor_2.toValue(1n),
                                                                                                                       alignment: _descriptor_2.alignment() } },
                                                                                                            { tag: 'value',
                                                                                                              value: { value: _descriptor_2.toValue(7n),
                                                                                                                       alignment: _descriptor_2.alignment() } }] } },
                                                                                            { popeq: { cached: false,
                                                                                                       result: undefined } }]).value),
                                 primaryAmount_0);
      this.__receiveIfPositive_0(context,
                                 partialProofData,
                                 this.__orderBondColor_0(context,
                                                         partialProofData),
                                 bondAmount_0);
    }
    const order_0 = { cancelCommitment:
                        this.__cancelCommitment_0(context,
                                                  partialProofData,
                                                  key_0),
                      owner: { bytes: ownerBytes_0 },
                      recipient: { bytes: recipientBytes_0 },
                      direction: orderDirection_0,
                      amountIn: primaryAmount_0,
                      amountAux: auxAmount_0,
                      minAmountOut: minOut_0,
                      deadline: expiry_0,
                      publicSettleAfter: publicAfter_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(order_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 2 } }]);
    return [];
  }
  _cancelLiquidityOrder_0(context, partialProofData, liquidityId_0) {
    const key_0 = liquidityId_0;
    __compactRuntime.assert(!this._equal_28(key_0, new Uint8Array(32)),
                            'E_LIQ_0');
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(11n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'E_LIQ_MISSING');
    const order_0 = _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(11n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(key_0),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const direction_0 = order_0.direction;
    this.__assertCancelSecretOrExpired_0(context,
                                         partialProofData,
                                         order_0.cancelCommitment,
                                         key_0,
                                         order_0.deadline);
    __compactRuntime.assert(direction_0 === 2 || direction_0 === 3, 'E_NOT_LIQ');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    const primaryAmount_0 = order_0.amountIn;
    const auxAmount_0 = order_0.amountAux;
    const owner_0 = order_0.owner;
    if (direction_0 === 2) {
      this.__sendTokenPairOutputsAndBond_0(context,
                                           partialProofData,
                                           primaryAmount_0,
                                           auxAmount_0,
                                           owner_0,
                                           owner_0,
                                           this.__orderBondAmount_0(context,
                                                                    partialProofData));
      return { amountA: primaryAmount_0, amountB: auxAmount_0, lpAmount: 0n };
    } else {
      this.__sendToUser_0(context,
                          partialProofData,
                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                    partialProofData,
                                                                                    [
                                                                                     { dup: { n: 0 } },
                                                                                     { idx: { cached: false,
                                                                                              pushPath: false,
                                                                                              path: [
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(1n),
                                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(7n),
                                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                                     { popeq: { cached: false,
                                                                                                result: undefined } }]).value),
                          primaryAmount_0,
                          owner_0);
      this.__sendToUser_0(context,
                          partialProofData,
                          this.__orderBondColor_0(context, partialProofData),
                          this.__orderBondAmount_0(context, partialProofData),
                          owner_0);
      return { amountA: 0n, amountB: 0n, lpAmount: primaryAmount_0 };
    }
  }
  _settleLiquidityOrder_0(context, partialProofData, liquidityId_0) {
    const key_0 = liquidityId_0;
    __compactRuntime.assert(!this._equal_29(key_0, new Uint8Array(32)),
                            'E_LIQ_0');
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(11n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'E_LIQ_MISSING');
    const order_0 = _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(11n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(key_0),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const direction_0 = order_0.direction;
    __compactRuntime.assert(direction_0 === 2 || direction_0 === 3, 'E_NOT_LIQ');
    this.__assertLiveDeadline_0(context, partialProofData, order_0.deadline);
    if (!this._blockTimeGte_0(context,
                              partialProofData,
                              order_0.publicSettleAfter))
    {
      this.__assertAuthorizedBatcher_0(context, partialProofData);
    }
    if (direction_0 === 2) {
      return this.__settleLiquidityAddByOrderKey_0(context,
                                                   partialProofData,
                                                   key_0,
                                                   order_0);
    } else {
      return this.__settleLiquidityRemoveByOrderKey_0(context,
                                                      partialProofData,
                                                      key_0,
                                                      order_0);
    }
  }
  _settleOne_0(context, partialProofData, orderId_0) {
    this.__assertAuthorizedBatcher_0(context, partialProofData);
    __compactRuntime.assert(!this._equal_30(orderId_0, new Uint8Array(32)),
                            'E_ORDER_0');
    return this.__settleById_0(context, partialProofData, orderId_0);
  }
  _settleBatchUpTo5_0(context,
                      partialProofData,
                      orderCount_0,
                      orderIdA_0,
                      orderIdB_0,
                      orderIdC_0,
                      orderIdD_0,
                      orderIdE_0)
  {
    this.__assertAuthorizedBatcher_0(context, partialProofData);
    const count_0 = orderCount_0;
    __compactRuntime.assert(count_0 >= 2n, 'E_BATCH_MIN');
    __compactRuntime.assert(count_0 <= 5n, 'E_BATCH_MAX');
    const start_0 = this.__startMixedBatchAccumulator_0(context,
                                                        partialProofData);
    const afterA_0 = this.__settleRequiredMixedBatchOrder_0(context,
                                                            partialProofData,
                                                            start_0,
                                                            orderIdA_0);
    const afterB_0 = this.__settleRequiredMixedBatchOrder_0(context,
                                                            partialProofData,
                                                            afterA_0,
                                                            orderIdB_0);
    if (this._equal_31(count_0, 2n)) {
      __compactRuntime.assert(this._equal_32(afterB_0.settledOrders, 2n),
                              'E_BATCH_COUNT');
      this.__finishMixedBatchSettlement_0(context, partialProofData, afterB_0);
      return afterB_0.settledOrders;
    } else {
      const afterC_0 = this.__settleRequiredMixedBatchOrder_0(context,
                                                              partialProofData,
                                                              afterB_0,
                                                              orderIdC_0);
      if (this._equal_33(count_0, 3n)) {
        __compactRuntime.assert(this._equal_34(afterC_0.settledOrders, 3n),
                                'E_BATCH_COUNT');
        this.__finishMixedBatchSettlement_0(context, partialProofData, afterC_0);
        return afterC_0.settledOrders;
      } else {
        const afterD_0 = this.__settleRequiredMixedBatchOrder_0(context,
                                                                partialProofData,
                                                                afterC_0,
                                                                orderIdD_0);
        if (this._equal_35(count_0, 4n)) {
          __compactRuntime.assert(this._equal_36(afterD_0.settledOrders, 4n),
                                  'E_BATCH_COUNT');
          this.__finishMixedBatchSettlement_0(context,
                                              partialProofData,
                                              afterD_0);
          return afterD_0.settledOrders;
        } else {
          const afterE_0 = this.__settleRequiredMixedBatchOrder_0(context,
                                                                  partialProofData,
                                                                  afterD_0,
                                                                  orderIdE_0);
          __compactRuntime.assert(this._equal_37(afterE_0.settledOrders, 5n),
                                  'E_BATCH_COUNT');
          this.__finishMixedBatchSettlement_0(context,
                                              partialProofData,
                                              afterE_0);
          return afterE_0.settledOrders;
        }
      }
    }
  }
  __settleLiquidityAddByOrderKey_0(context, partialProofData, key_0, order_0) {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(8n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0 > 0n),
                            'E_POOL_0');
    let t_1, t_2;
    __compactRuntime.assert((t_2 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(9n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_2 > 0n)
                            &&
                            (t_1 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(10n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_1 > 0n),
                            'E_RESERVES');
    const maxAmountA_0 = order_0.amountIn;
    const maxAmountB_0 = order_0.amountAux;
    const minLp_0 = order_0.minAmountOut;
    const owner_0 = order_0.owner;
    const recipient_0 = order_0.recipient;
    const plan_0 = this.__quoteLiquidityFromMaxOrFail_0(context,
                                                        partialProofData,
                                                        maxAmountA_0,
                                                        maxAmountB_0,
                                                        minLp_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    this.__applyLiquidityPlan_0(context,
                                partialProofData,
                                maxAmountA_0,
                                maxAmountB_0,
                                plan_0,
                                recipient_0,
                                owner_0,
                                this.__orderBondAmount_0(context,
                                                         partialProofData));
    return { amountA: plan_0.usedAmountA,
             amountB: plan_0.usedAmountB,
             lpAmount: plan_0.lpOut };
  }
  __settleLiquidityRemoveByOrderKey_0(context, partialProofData, key_0, order_0)
  {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(8n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0 > 0n),
                            'E_NO_LP_SUPPLY');
    __compactRuntime.assert(!this.__isZeroBytes32_0(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                              partialProofData,
                                                                                                              [
                                                                                                               { dup: { n: 0 } },
                                                                                                               { idx: { cached: false,
                                                                                                                        pushPath: false,
                                                                                                                        path: [
                                                                                                                               { tag: 'value',
                                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                                               { tag: 'value',
                                                                                                                                 value: { value: _descriptor_2.toValue(7n),
                                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                                               { popeq: { cached: false,
                                                                                                                          result: undefined } }]).value)),
                            'E_LP_TYPE_0');
    let t_1, t_2;
    __compactRuntime.assert((t_2 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(9n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_2 > 0n)
                            &&
                            (t_1 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(10n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_1 > 0n),
                            'E_RESERVES');
    const lpDelta_0 = order_0.amountIn;
    const minAmountA_0 = order_0.amountAux;
    const minAmountB_0 = order_0.minAmountOut;
    const owner_0 = order_0.owner;
    const recipient_0 = order_0.recipient;
    __compactRuntime.assert(lpDelta_0
                            <=
                            _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(8n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'E_LP_AMOUNT');
    const nextLPSupply_0 = this.__subU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(8n),
                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value),
                                           lpDelta_0);
    __compactRuntime.assert(nextLPSupply_0 >= this.__minimumLiquidity_0(),
                            'E_LOCKED_LP');
    const withdrawal_0 = this.__quoteWithdrawLiquidityOrFail_0(context,
                                                               partialProofData,
                                                               lpDelta_0,
                                                               minAmountA_0,
                                                               minAmountB_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nextLPSupply_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this.__burnLp_0(context, partialProofData, lpDelta_0);
    const tmp_0 = this.__subU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(9n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  withdrawal_0.amountAOut);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this.__subU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  withdrawal_0.amountBOut);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    this.__assertAggregateOutputCoverage_0(context,
                                           partialProofData,
                                           withdrawal_0.amountAOut,
                                           withdrawal_0.amountBOut,
                                           this.__orderBondAmount_0(context,
                                                                    partialProofData));
    this.__sendTokenPairOutputsAndBond_0(context,
                                         partialProofData,
                                         withdrawal_0.amountAOut,
                                         withdrawal_0.amountBOut,
                                         recipient_0,
                                         owner_0,
                                         this.__orderBondAmount_0(context,
                                                                  partialProofData));
    return { amountA: withdrawal_0.amountAOut,
             amountB: withdrawal_0.amountBOut,
             lpAmount: lpDelta_0 };
  }
  __startMixedBatchAccumulator_0(context, partialProofData) {
    return { nextReserveA:
               _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(9n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value),
             nextReserveB:
               _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(10n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value),
             protocolFeeTotalA: 0n,
             protocolFeeTotalB: 0n,
             scheduledOutA: 0n,
             scheduledOutB: 0n,
             scheduledBondOut: 0n,
             settledOrders: 0n };
  }
  __settleRequiredMixedBatchOrder_0(context, partialProofData, acc_0, orderKey_0)
  {
    __compactRuntime.assert(!this._equal_38(orderKey_0, new Uint8Array(32)),
                            'E_BATCH_ID_0');
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(11n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(orderKey_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'E_BATCH_MISSING');
    return this.__settleMixedBatchOrder_0(context,
                                          partialProofData,
                                          acc_0,
                                          orderKey_0);
  }
  __settleMixedBatchOrder_0(context, partialProofData, acc_0, orderKey_0) {
    const order_0 = _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(11n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(orderKey_0),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const direction_0 = order_0.direction;
    const amountIn_0 = order_0.amountIn;
    const protocolFee_0 = order_0.amountAux;
    const minOut_0 = order_0.minAmountOut;
    const recipient_0 = order_0.recipient;
    const owner_0 = order_0.owner;
    __compactRuntime.assert(direction_0 === 0 || direction_0 === 1,
                            'E_BATCH_DIR');
    this.__assertLiveDeadline_0(context, partialProofData, order_0.deadline);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(orderKey_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    if (direction_0 === 0) {
      const execution_0 = this.__quoteAtoBOrFail_0(context,
                                                   partialProofData,
                                                   amountIn_0,
                                                   protocolFee_0,
                                                   minOut_0,
                                                   acc_0.nextReserveA,
                                                   acc_0.nextReserveB);
      this.__sendSingleTokenOutputAndBond_0(context,
                                            partialProofData,
                                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(2n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value),
                                            execution_0.amountOut,
                                            recipient_0,
                                            owner_0,
                                            this.__orderBondAmount_0(context,
                                                                     partialProofData));
      return { nextReserveA:
                 this.__addU64_0(acc_0.nextReserveA, execution_0.reserveAmountIn),
               nextReserveB:
                 this.__subU64_0(acc_0.nextReserveB, execution_0.amountOut),
               protocolFeeTotalA:
                 this.__addU64_0(acc_0.protocolFeeTotalA, protocolFee_0),
               protocolFeeTotalB: acc_0.protocolFeeTotalB,
               scheduledOutA: acc_0.scheduledOutA,
               scheduledOutB:
                 this.__addU128_0(acc_0.scheduledOutB, execution_0.amountOut),
               scheduledBondOut:
                 this.__addU128_0(acc_0.scheduledBondOut,
                                  this.__orderBondAmount_0(context,
                                                           partialProofData)),
               settledOrders:
                 ((t1) => {
                   if (t1 > 65535n) {
                     throw new __compactRuntime.CompactError('contract.compact line 718 char 22: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 65535');
                   }
                   return t1;
                 })(acc_0.settledOrders + 1n) };
    } else {
      const execution_1 = this.__quoteBtoAOrFail_0(context,
                                                   partialProofData,
                                                   amountIn_0,
                                                   protocolFee_0,
                                                   minOut_0,
                                                   acc_0.nextReserveA,
                                                   acc_0.nextReserveB);
      this.__sendSingleTokenOutputAndBond_0(context,
                                            partialProofData,
                                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value),
                                            execution_1.amountOut,
                                            recipient_0,
                                            owner_0,
                                            this.__orderBondAmount_0(context,
                                                                     partialProofData));
      return { nextReserveA:
                 this.__subU64_0(acc_0.nextReserveA, execution_1.amountOut),
               nextReserveB:
                 this.__addU64_0(acc_0.nextReserveB, execution_1.reserveAmountIn),
               protocolFeeTotalA: acc_0.protocolFeeTotalA,
               protocolFeeTotalB:
                 this.__addU64_0(acc_0.protocolFeeTotalB, protocolFee_0),
               scheduledOutA:
                 this.__addU128_0(acc_0.scheduledOutA, execution_1.amountOut),
               scheduledOutB: acc_0.scheduledOutB,
               scheduledBondOut:
                 this.__addU128_0(acc_0.scheduledBondOut,
                                  this.__orderBondAmount_0(context,
                                                           partialProofData)),
               settledOrders:
                 ((t1) => {
                   if (t1 > 65535n) {
                     throw new __compactRuntime.CompactError('contract.compact line 746 char 20: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 65535');
                   }
                   return t1;
                 })(acc_0.settledOrders + 1n) };
    }
  }
  __finishMixedBatchSettlement_0(context, partialProofData, acc_0) {
    const tmp_0 = acc_0.nextReserveA;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = acc_0.nextReserveB;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    let t_0;
    if (t_0 = acc_0.protocolFeeTotalA, t_0 > 0n) {
      const tmp_2 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(5n),
                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value),
                                    acc_0.protocolFeeTotalA);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                                alignment: _descriptor_2.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    let t_1;
    if (t_1 = acc_0.protocolFeeTotalB, t_1 > 0n) {
      const tmp_3 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(6n),
                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value),
                                    acc_0.protocolFeeTotalB);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                                alignment: _descriptor_2.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_3),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    this.__assertAggregateOutputCoverage_0(context,
                                           partialProofData,
                                           acc_0.scheduledOutA,
                                           acc_0.scheduledOutB,
                                           acc_0.scheduledBondOut);
    return [];
  }
  __settleById_0(context, partialProofData, orderId_0) {
    const key_0 = orderId_0;
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(11n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'E_ORDER_MISSING');
    const order_0 = _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(11n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(key_0),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const direction_0 = order_0.direction;
    __compactRuntime.assert(direction_0 === 0 || direction_0 === 1, 'E_NOT_SWAP');
    this.__assertLiveDeadline_0(context, partialProofData, order_0.deadline);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } },
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(11n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { rem: { cached: false } },
                                       { ins: { cached: true, n: 2 } }]);
    if (direction_0 === 0) {
      return this.__settleAtoB_0(context, partialProofData, order_0);
    } else {
      return this.__settleBtoA_0(context, partialProofData, order_0);
    }
  }
  __settleAtoB_0(context, partialProofData, order_0) {
    const amountIn_0 = order_0.amountIn;
    const protocolFee_0 = order_0.amountAux;
    const minOut_0 = order_0.minAmountOut;
    const owner_0 = order_0.owner;
    const recipient_0 = order_0.recipient;
    const execution_0 = this.__quoteAtoBOrFail_0(context,
                                                 partialProofData,
                                                 amountIn_0,
                                                 protocolFee_0,
                                                 minOut_0,
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(1n),
                                                                                                                                       alignment: _descriptor_2.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(9n),
                                                                                                                                       alignment: _descriptor_2.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(1n),
                                                                                                                                       alignment: _descriptor_2.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(10n),
                                                                                                                                       alignment: _descriptor_2.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value));
    const tmp_0 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(9n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  execution_0.reserveAmountIn);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this.__subU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  execution_0.amountOut);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (protocolFee_0 > 0n) {
      const tmp_2 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(5n),
                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value),
                                    protocolFee_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(5n),
                                                                                                alignment: _descriptor_2.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    this.__assertAggregateOutputCoverage_0(context,
                                           partialProofData,
                                           0n,
                                           execution_0.amountOut,
                                           this.__orderBondAmount_0(context,
                                                                    partialProofData));
    this.__sendSingleTokenOutputAndBond_0(context,
                                          partialProofData,
                                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_2.toValue(0n),
                                                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_2.toValue(2n),
                                                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          execution_0.amountOut,
                                          recipient_0,
                                          owner_0,
                                          this.__orderBondAmount_0(context,
                                                                   partialProofData));
    return { executed: true,
             amountIn: amountIn_0,
             amountOut: execution_0.amountOut };
  }
  __settleBtoA_0(context, partialProofData, order_0) {
    const amountIn_0 = order_0.amountIn;
    const protocolFee_0 = order_0.amountAux;
    const minOut_0 = order_0.minAmountOut;
    const owner_0 = order_0.owner;
    const recipient_0 = order_0.recipient;
    const execution_0 = this.__quoteBtoAOrFail_0(context,
                                                 partialProofData,
                                                 amountIn_0,
                                                 protocolFee_0,
                                                 minOut_0,
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(1n),
                                                                                                                                       alignment: _descriptor_2.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(9n),
                                                                                                                                       alignment: _descriptor_2.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(1n),
                                                                                                                                       alignment: _descriptor_2.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(10n),
                                                                                                                                       alignment: _descriptor_2.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value));
    const tmp_0 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  execution_0.reserveAmountIn);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this.__subU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(9n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  execution_0.amountOut);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (protocolFee_0 > 0n) {
      const tmp_2 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(6n),
                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value),
                                    protocolFee_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(6n),
                                                                                                alignment: _descriptor_2.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_2),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    this.__assertAggregateOutputCoverage_0(context,
                                           partialProofData,
                                           execution_0.amountOut,
                                           0n,
                                           this.__orderBondAmount_0(context,
                                                                    partialProofData));
    this.__sendSingleTokenOutputAndBond_0(context,
                                          partialProofData,
                                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_2.toValue(0n),
                                                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_2.toValue(1n),
                                                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value),
                                          execution_0.amountOut,
                                          recipient_0,
                                          owner_0,
                                          this.__orderBondAmount_0(context,
                                                                   partialProofData));
    return { executed: true,
             amountIn: amountIn_0,
             amountOut: execution_0.amountOut };
  }
  __mintLpToUser_0(context, partialProofData, amount_0, recipient_0) {
    __compactRuntime.assert(amount_0 > 0n, 'E_LP_MINT_0');
    const mintedType_0 = this._mintUnshieldedToken_0(context,
                                                     partialProofData,
                                                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                               partialProofData,
                                                                                                               [
                                                                                                                { dup: { n: 0 } },
                                                                                                                { idx: { cached: false,
                                                                                                                         pushPath: false,
                                                                                                                         path: [
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(0n),
                                                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(3n),
                                                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                                                { popeq: { cached: false,
                                                                                                                           result: undefined } }]).value),
                                                     amount_0,
                                                     this._right_0(recipient_0));
    if (this.__isZeroBytes32_0(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(7n),
                                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                                          { popeq: { cached: false,
                                                                                                     result: undefined } }]).value)))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(7n),
                                                                                                alignment: _descriptor_2.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(mintedType_0),
                                                                                                alignment: _descriptor_1.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    } else {
      __compactRuntime.assert(this._equal_39(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                       partialProofData,
                                                                                                       [
                                                                                                        { dup: { n: 0 } },
                                                                                                        { idx: { cached: false,
                                                                                                                 pushPath: false,
                                                                                                                 path: [
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                                        { tag: 'value',
                                                                                                                          value: { value: _descriptor_2.toValue(7n),
                                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                                        { popeq: { cached: false,
                                                                                                                   result: undefined } }]).value),
                                             mintedType_0),
                              'E_LP_TYPE');
    }
    const tmp_0 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(8n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  amount_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(8n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  __applyLiquidityPlan_0(context,
                         partialProofData,
                         maxAmountA_0,
                         maxAmountB_0,
                         plan_0,
                         lpRecipient_0,
                         refundRecipient_0,
                         bondRefundAmount_0)
  {
    const tmp_0 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(9n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  plan_0.usedAmountA);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(9n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = this.__addU64_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  plan_0.usedAmountB);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_2.toValue(1n),
                                                                  alignment: _descriptor_2.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(10n),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_1),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const refundA_0 = this.__subU64_0(maxAmountA_0, plan_0.usedAmountA);
    const refundB_0 = this.__subU64_0(maxAmountB_0, plan_0.usedAmountB);
    this.__assertAggregateOutputCoverage_0(context,
                                           partialProofData,
                                           refundA_0,
                                           refundB_0,
                                           bondRefundAmount_0);
    this.__sendTokenPairOutputsAndBond_0(context,
                                         partialProofData,
                                         refundA_0,
                                         refundB_0,
                                         refundRecipient_0,
                                         refundRecipient_0,
                                         bondRefundAmount_0);
    this.__mintLpToUser_0(context, partialProofData, plan_0.lpOut, lpRecipient_0);
    return [];
  }
  __quoteLiquidityFromMaxOrFail_0(context,
                                  partialProofData,
                                  maxAmountA_0,
                                  maxAmountB_0,
                                  minLpOut_0)
  {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(8n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0 > 0n),
                            'E_POOL_0');
    let t_1, t_2;
    __compactRuntime.assert((t_2 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(9n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_2 > 0n)
                            &&
                            (t_1 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(10n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_1 > 0n),
                            'E_RESERVES');
    const aCross_0 = maxAmountA_0
                     *
                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(10n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const bCross_0 = maxAmountB_0
                     *
                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_2.toValue(9n),
                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    if (aCross_0 <= bCross_0) {
      const lpNumeratorA_0 = maxAmountA_0
                             *
                             _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(8n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value);
      __compactRuntime.assert(this.__floorDivU128ByU64FitsU64_0(lpNumeratorA_0,
                                                                _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                          partialProofData,
                                                                                                                          [
                                                                                                                           { dup: { n: 0 } },
                                                                                                                           { idx: { cached: false,
                                                                                                                                    pushPath: false,
                                                                                                                                    path: [
                                                                                                                                           { tag: 'value',
                                                                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                                                                           { tag: 'value',
                                                                                                                                             value: { value: _descriptor_2.toValue(9n),
                                                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                                                           { popeq: { cached: false,
                                                                                                                                      result: undefined } }]).value)),
                              'E_LP_OVERFLOW');
      const lpOut_0 = this.__divU128ByU64Checked_0(context,
                                                   partialProofData,
                                                   lpNumeratorA_0,
                                                   _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                             partialProofData,
                                                                                                             [
                                                                                                              { dup: { n: 0 } },
                                                                                                              { idx: { cached: false,
                                                                                                                       pushPath: false,
                                                                                                                       path: [
                                                                                                                              { tag: 'value',
                                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                                              { tag: 'value',
                                                                                                                                value: { value: _descriptor_2.toValue(9n),
                                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                                              { popeq: { cached: false,
                                                                                                                         result: undefined } }]).value));
      __compactRuntime.assert(lpOut_0 > 0n, 'E_LP_SMALL');
      __compactRuntime.assert(lpOut_0 >= minLpOut_0, 'E_LP_OUT');
      const plan_0 = this.__quoteLiquidityForExactLpOrFail_0(context,
                                                             partialProofData,
                                                             lpOut_0);
      let t_3;
      __compactRuntime.assert((t_3 = plan_0.usedAmountA, t_3 <= maxAmountA_0),
                              'E_PLAN_A');
      let t_4;
      __compactRuntime.assert((t_4 = plan_0.usedAmountB, t_4 <= maxAmountB_0),
                              'E_PLAN_B');
      return plan_0;
    } else {
      const lpNumeratorB_0 = maxAmountB_0
                             *
                             _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_2.toValue(8n),
                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                        { popeq: { cached: false,
                                                                                                   result: undefined } }]).value);
      __compactRuntime.assert(this.__floorDivU128ByU64FitsU64_0(lpNumeratorB_0,
                                                                _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                          partialProofData,
                                                                                                                          [
                                                                                                                           { dup: { n: 0 } },
                                                                                                                           { idx: { cached: false,
                                                                                                                                    pushPath: false,
                                                                                                                                    path: [
                                                                                                                                           { tag: 'value',
                                                                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                                                                           { tag: 'value',
                                                                                                                                             value: { value: _descriptor_2.toValue(10n),
                                                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                                                           { popeq: { cached: false,
                                                                                                                                      result: undefined } }]).value)),
                              'E_LP_OVERFLOW');
      const lpOut_1 = this.__divU128ByU64Checked_0(context,
                                                   partialProofData,
                                                   lpNumeratorB_0,
                                                   _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                             partialProofData,
                                                                                                             [
                                                                                                              { dup: { n: 0 } },
                                                                                                              { idx: { cached: false,
                                                                                                                       pushPath: false,
                                                                                                                       path: [
                                                                                                                              { tag: 'value',
                                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                                              { tag: 'value',
                                                                                                                                value: { value: _descriptor_2.toValue(10n),
                                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                                              { popeq: { cached: false,
                                                                                                                         result: undefined } }]).value));
      __compactRuntime.assert(lpOut_1 > 0n, 'E_LP_SMALL');
      __compactRuntime.assert(lpOut_1 >= minLpOut_0, 'E_LP_OUT');
      const plan_1 = this.__quoteLiquidityForExactLpOrFail_0(context,
                                                             partialProofData,
                                                             lpOut_1);
      let t_5;
      __compactRuntime.assert((t_5 = plan_1.usedAmountA, t_5 <= maxAmountA_0),
                              'E_PLAN_A');
      let t_6;
      __compactRuntime.assert((t_6 = plan_1.usedAmountB, t_6 <= maxAmountB_0),
                              'E_PLAN_B');
      return plan_1;
    }
  }
  __quoteLiquidityForExactLpOrFail_0(context, partialProofData, lpOut_0) {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(8n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0 > 0n),
                            'E_POOL_0');
    let t_1, t_2;
    __compactRuntime.assert((t_2 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(9n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_2 > 0n)
                            &&
                            (t_1 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(10n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_1 > 0n),
                            'E_RESERVES');
    __compactRuntime.assert(lpOut_0 > 0n, 'E_LP_OUT_0');
    const numeratorA_0 = lpOut_0
                         *
                         _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                                                               alignment: _descriptor_2.alignment() } },
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(9n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    const numeratorB_0 = lpOut_0
                         *
                         _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                                                               alignment: _descriptor_2.alignment() } },
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(10n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
    __compactRuntime.assert(this.__ceilDivU128ByU64FitsU64_0(numeratorA_0,
                                                             _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                       partialProofData,
                                                                                                                       [
                                                                                                                        { dup: { n: 0 } },
                                                                                                                        { idx: { cached: false,
                                                                                                                                 pushPath: false,
                                                                                                                                 path: [
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_2.toValue(8n),
                                                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                                                        { popeq: { cached: false,
                                                                                                                                   result: undefined } }]).value)),
                            'E_USE_A');
    __compactRuntime.assert(this.__ceilDivU128ByU64FitsU64_0(numeratorB_0,
                                                             _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                       partialProofData,
                                                                                                                       [
                                                                                                                        { dup: { n: 0 } },
                                                                                                                        { idx: { cached: false,
                                                                                                                                 pushPath: false,
                                                                                                                                 path: [
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                                                                        { tag: 'value',
                                                                                                                                          value: { value: _descriptor_2.toValue(8n),
                                                                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                                                                        { popeq: { cached: false,
                                                                                                                                   result: undefined } }]).value)),
                            'E_USE_B');
    const usedAmountA_0 = this.__ceilDivU128ByU64Checked_0(context,
                                                           partialProofData,
                                                           numeratorA_0,
                                                           _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                     partialProofData,
                                                                                                                     [
                                                                                                                      { dup: { n: 0 } },
                                                                                                                      { idx: { cached: false,
                                                                                                                               pushPath: false,
                                                                                                                               path: [
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(8n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                                      { popeq: { cached: false,
                                                                                                                                 result: undefined } }]).value));
    const usedAmountB_0 = this.__ceilDivU128ByU64Checked_0(context,
                                                           partialProofData,
                                                           numeratorB_0,
                                                           _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                     partialProofData,
                                                                                                                     [
                                                                                                                      { dup: { n: 0 } },
                                                                                                                      { idx: { cached: false,
                                                                                                                               pushPath: false,
                                                                                                                               path: [
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(8n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                                      { popeq: { cached: false,
                                                                                                                                 result: undefined } }]).value));
    return { usedAmountA: usedAmountA_0,
             usedAmountB: usedAmountB_0,
             lpOut: lpOut_0 };
  }
  __quoteWithdrawLiquidityOrFail_0(context,
                                   partialProofData,
                                   lpAmount_0,
                                   minAmountAOut_0,
                                   minAmountBOut_0)
  {
    let t_0;
    __compactRuntime.assert((t_0 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(8n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_0 > 0n),
                            'E_NO_LP_SUPPLY');
    let t_1, t_2;
    __compactRuntime.assert((t_2 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(9n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_2 > 0n)
                            ||
                            (t_1 = _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(10n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             t_1 > 0n),
                            'E_NO_LIQ');
    const amountAOutNumerator_0 = lpAmount_0
                                  *
                                  _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(9n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value);
    const amountBOutNumerator_0 = lpAmount_0
                                  *
                                  _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(10n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value);
    const amountAOut_0 = this.__divU128ByU64Checked_0(context,
                                                      partialProofData,
                                                      amountAOutNumerator_0,
                                                      _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                partialProofData,
                                                                                                                [
                                                                                                                 { dup: { n: 0 } },
                                                                                                                 { idx: { cached: false,
                                                                                                                          pushPath: false,
                                                                                                                          path: [
                                                                                                                                 { tag: 'value',
                                                                                                                                   value: { value: _descriptor_2.toValue(1n),
                                                                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                                                                 { tag: 'value',
                                                                                                                                   value: { value: _descriptor_2.toValue(8n),
                                                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                                                 { popeq: { cached: false,
                                                                                                                            result: undefined } }]).value));
    const amountBOut_0 = this.__divU128ByU64Checked_0(context,
                                                      partialProofData,
                                                      amountBOutNumerator_0,
                                                      _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                partialProofData,
                                                                                                                [
                                                                                                                 { dup: { n: 0 } },
                                                                                                                 { idx: { cached: false,
                                                                                                                          pushPath: false,
                                                                                                                          path: [
                                                                                                                                 { tag: 'value',
                                                                                                                                   value: { value: _descriptor_2.toValue(1n),
                                                                                                                                            alignment: _descriptor_2.alignment() } },
                                                                                                                                 { tag: 'value',
                                                                                                                                   value: { value: _descriptor_2.toValue(8n),
                                                                                                                                            alignment: _descriptor_2.alignment() } }] } },
                                                                                                                 { popeq: { cached: false,
                                                                                                                            result: undefined } }]).value));
    __compactRuntime.assert(amountAOut_0 >= minAmountAOut_0, 'E_SLIP_A');
    __compactRuntime.assert(amountBOut_0 >= minAmountBOut_0, 'E_SLIP_B');
    __compactRuntime.assert(amountAOut_0 > 0n || amountBOut_0 > 0n, 'E_ZERO_OUT');
    return { amountAOut: amountAOut_0, amountBOut: amountBOut_0 };
  }
  __sendToUser_0(context, partialProofData, color_0, amount_0, recipient_0) {
    this.__sendToUserU128_0(context,
                            partialProofData,
                            color_0,
                            amount_0,
                            recipient_0);
    return [];
  }
  __sendToUserU128_0(context, partialProofData, color_0, amount_0, recipient_0)
  {
    if (this._equal_40(amount_0, 0n)) {
      return [];
    } else {
      this._sendUnshielded_0(context,
                             partialProofData,
                             color_0,
                             amount_0,
                             this._right_0(recipient_0));
      return [];
    }
  }
  __sendSingleTokenOutputAndBond_0(context,
                                   partialProofData,
                                   tokenColor_0,
                                   tokenAmount_0,
                                   tokenRecipient_0,
                                   bondRecipient_0,
                                   bondAmount_0)
  {
    const tokenOut_0 = tokenAmount_0;
    const bondOut_0 = bondAmount_0;
    if (this._equal_41(tokenColor_0,
                       this.__orderBondColor_0(context, partialProofData)))
    {
      const combined_0 = this.__addU128_0(tokenOut_0, bondOut_0);
      this.__assertCoverageAmountFitsRuntime_0(combined_0);
      if (this.__sameUserAddress_0(tokenRecipient_0, bondRecipient_0)) {
        this.__sendToUserU128_0(context,
                                partialProofData,
                                tokenColor_0,
                                combined_0,
                                tokenRecipient_0);
        return [];
      } else {
        this.__sendToUserU128_0(context,
                                partialProofData,
                                tokenColor_0,
                                tokenOut_0,
                                tokenRecipient_0);
        this.__sendToUserU128_0(context,
                                partialProofData,
                                this.__orderBondColor_0(context,
                                                        partialProofData),
                                bondOut_0,
                                bondRecipient_0);
        return [];
      }
    } else {
      this.__sendToUserU128_0(context,
                              partialProofData,
                              tokenColor_0,
                              tokenOut_0,
                              tokenRecipient_0);
      this.__sendToUserU128_0(context,
                              partialProofData,
                              this.__orderBondColor_0(context, partialProofData),
                              bondOut_0,
                              bondRecipient_0);
      return [];
    }
  }
  __sendTokenPairOutputsAndBond_0(context,
                                  partialProofData,
                                  tokenAAmount_0,
                                  tokenBAmount_0,
                                  tokenRecipient_0,
                                  bondRecipient_0,
                                  bondAmount_0)
  {
    const tokenAOut_0 = tokenAAmount_0;
    const tokenBOut_0 = tokenBAmount_0;
    const bondOut_0 = bondAmount_0;
    if (this._equal_42(this.__orderBondColor_0(context, partialProofData),
                       _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 0 } },
                                                                                  { idx: { cached: false,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(0n),
                                                                                                             alignment: _descriptor_2.alignment() } },
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_2.toValue(1n),
                                                                                                             alignment: _descriptor_2.alignment() } }] } },
                                                                                  { popeq: { cached: false,
                                                                                             result: undefined } }]).value)))
    {
      const combinedA_0 = this.__addU128_0(tokenAOut_0, bondOut_0);
      this.__assertCoverageAmountFitsRuntime_0(combinedA_0);
      if (this.__sameUserAddress_0(tokenRecipient_0, bondRecipient_0)) {
        this.__sendToUserU128_0(context,
                                partialProofData,
                                _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value),
                                combinedA_0,
                                tokenRecipient_0);
      } else {
        this.__sendToUserU128_0(context,
                                partialProofData,
                                _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value),
                                tokenAOut_0,
                                tokenRecipient_0);
        this.__sendToUserU128_0(context,
                                partialProofData,
                                this.__orderBondColor_0(context,
                                                        partialProofData),
                                bondOut_0,
                                bondRecipient_0);
      }
      this.__sendToUserU128_0(context,
                              partialProofData,
                              _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_2.toValue(0n),
                                                                                                                    alignment: _descriptor_2.alignment() } },
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_2.toValue(2n),
                                                                                                                    alignment: _descriptor_2.alignment() } }] } },
                                                                                         { popeq: { cached: false,
                                                                                                    result: undefined } }]).value),
                              tokenBOut_0,
                              tokenRecipient_0);
      return [];
    } else {
      if (this._equal_43(this.__orderBondColor_0(context, partialProofData),
                         _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(0n),
                                                                                                               alignment: _descriptor_2.alignment() } },
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_2.toValue(2n),
                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value)))
      {
        const combinedB_0 = this.__addU128_0(tokenBOut_0, bondOut_0);
        this.__assertCoverageAmountFitsRuntime_0(combinedB_0);
        this.__sendToUserU128_0(context,
                                partialProofData,
                                _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value),
                                tokenAOut_0,
                                tokenRecipient_0);
        if (this.__sameUserAddress_0(tokenRecipient_0, bondRecipient_0)) {
          this.__sendToUserU128_0(context,
                                  partialProofData,
                                  _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(0n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(2n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  combinedB_0,
                                  tokenRecipient_0);
        } else {
          this.__sendToUserU128_0(context,
                                  partialProofData,
                                  _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                            partialProofData,
                                                                                            [
                                                                                             { dup: { n: 0 } },
                                                                                             { idx: { cached: false,
                                                                                                      pushPath: false,
                                                                                                      path: [
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(0n),
                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                             { tag: 'value',
                                                                                                               value: { value: _descriptor_2.toValue(2n),
                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                             { popeq: { cached: false,
                                                                                                        result: undefined } }]).value),
                                  tokenBOut_0,
                                  tokenRecipient_0);
          this.__sendToUserU128_0(context,
                                  partialProofData,
                                  this.__orderBondColor_0(context,
                                                          partialProofData),
                                  bondOut_0,
                                  bondRecipient_0);
        }
        return [];
      } else {
        this.__sendToUserU128_0(context,
                                partialProofData,
                                _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value),
                                tokenAOut_0,
                                tokenRecipient_0);
        this.__sendToUserU128_0(context,
                                partialProofData,
                                _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                          partialProofData,
                                                                                          [
                                                                                           { dup: { n: 0 } },
                                                                                           { idx: { cached: false,
                                                                                                    pushPath: false,
                                                                                                    path: [
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(0n),
                                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                                           { tag: 'value',
                                                                                                             value: { value: _descriptor_2.toValue(2n),
                                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                                           { popeq: { cached: false,
                                                                                                      result: undefined } }]).value),
                                tokenBOut_0,
                                tokenRecipient_0);
        this.__sendToUserU128_0(context,
                                partialProofData,
                                this.__orderBondColor_0(context,
                                                        partialProofData),
                                bondOut_0,
                                bondRecipient_0);
        return [];
      }
    }
  }
  __receiveIfPositive_0(context, partialProofData, color_0, amount_0) {
    if (amount_0 > 0n) {
      this.__assertCoverageAmountFitsRuntime_0(amount_0);
      let t_0, t_1;
      const exclusiveLimit_0 = (t_0 = this.__maxU64_0(),
                                (t_1 = ((t1) => {
                                         if (t1 > 18446744073709551615n) {
                                           throw new __compactRuntime.CompactError('contract.compact line 1098 char 20: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                         }
                                         return t1;
                                       })(amount_0),
                                 (__compactRuntime.assert(t_0 >= t_1,
                                                          'result of subtraction would be negative'),
                                  t_0 - t_1)))
                               +
                               1n;
      __compactRuntime.assert(this._unshieldedBalanceLt_0(context,
                                                          partialProofData,
                                                          color_0,
                                                          exclusiveLimit_0),
                              'E_BALANCE_CAP');
      this._receiveUnshielded_0(context, partialProofData, color_0, amount_0);
    }
    return [];
  }
  __receiveTokenAndBondInputs_0(context,
                                partialProofData,
                                tokenAIn_0,
                                tokenBIn_0,
                                bondIn_0)
  {
    const tokenARequired_0 = this.__addIfSameColor_0(tokenAIn_0,
                                                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                               partialProofData,
                                                                                                               [
                                                                                                                { dup: { n: 0 } },
                                                                                                                { idx: { cached: false,
                                                                                                                         pushPath: false,
                                                                                                                         path: [
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(0n),
                                                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(1n),
                                                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                                                { popeq: { cached: false,
                                                                                                                           result: undefined } }]).value),
                                                     this.__orderBondColor_0(context,
                                                                             partialProofData),
                                                     bondIn_0);
    const tokenBRequired_0 = this.__addIfSameColor_0(tokenBIn_0,
                                                     _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                               partialProofData,
                                                                                                               [
                                                                                                                { dup: { n: 0 } },
                                                                                                                { idx: { cached: false,
                                                                                                                         pushPath: false,
                                                                                                                         path: [
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(0n),
                                                                                                                                           alignment: _descriptor_2.alignment() } },
                                                                                                                                { tag: 'value',
                                                                                                                                  value: { value: _descriptor_2.toValue(2n),
                                                                                                                                           alignment: _descriptor_2.alignment() } }] } },
                                                                                                                { popeq: { cached: false,
                                                                                                                           result: undefined } }]).value),
                                                     this.__orderBondColor_0(context,
                                                                             partialProofData),
                                                     bondIn_0);
    this.__receiveIfPositive_0(context,
                               partialProofData,
                               _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                                          { popeq: { cached: false,
                                                                                                     result: undefined } }]).value),
                               tokenARequired_0);
    this.__receiveIfPositive_0(context,
                               partialProofData,
                               _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                         partialProofData,
                                                                                         [
                                                                                          { dup: { n: 0 } },
                                                                                          { idx: { cached: false,
                                                                                                   pushPath: false,
                                                                                                   path: [
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(0n),
                                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                                          { tag: 'value',
                                                                                                            value: { value: _descriptor_2.toValue(2n),
                                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                                          { popeq: { cached: false,
                                                                                                     result: undefined } }]).value),
                               tokenBRequired_0);
    if (!this._equal_44(this.__orderBondColor_0(context, partialProofData),
                        _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(0n),
                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(1n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value))
        &&
        !this._equal_45(this.__orderBondColor_0(context, partialProofData),
                        _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(0n),
                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(2n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value)))
    {
      this.__receiveIfPositive_0(context,
                                 partialProofData,
                                 this.__orderBondColor_0(context,
                                                         partialProofData),
                                 bondIn_0);
    }
    return [];
  }
  __quoteAtoBOrFail_0(context,
                      partialProofData,
                      amountIn_0,
                      protocolFee_0,
                      minOut_0,
                      currentReserveA_0,
                      currentReserveB_0)
  {
    __compactRuntime.assert(currentReserveA_0 > 0n && currentReserveB_0 > 0n,
                            'E_NO_LIQ');
    const effectiveIn_0 = this.__effectiveAmountIn_0(context,
                                                     partialProofData,
                                                     amountIn_0);
    __compactRuntime.assert(effectiveIn_0 > 0n, 'E_TRADE_SMALL');
    const totalFee_0 = this.__subU64_0(amountIn_0, effectiveIn_0);
    __compactRuntime.assert(protocolFee_0 <= totalFee_0, 'E_PROTOCOL_FEE');
    const reserveAmountIn_0 = this.__subU64_0(amountIn_0, protocolFee_0);
    const denominator_0 = this.__addU64_0(currentReserveA_0, effectiveIn_0);
    const numerator_0 = effectiveIn_0 * currentReserveB_0;
    const amountOut_0 = this.__divU128ByU64Checked_0(context,
                                                     partialProofData,
                                                     numerator_0,
                                                     denominator_0);
    __compactRuntime.assert(amountOut_0 > 0n, 'E_ZERO_OUT');
    __compactRuntime.assert(amountOut_0 >= minOut_0, 'E_MIN_OUT');
    return { reserveAmountIn: reserveAmountIn_0, amountOut: amountOut_0 };
  }
  __quoteBtoAOrFail_0(context,
                      partialProofData,
                      amountIn_0,
                      protocolFee_0,
                      minOut_0,
                      currentReserveA_0,
                      currentReserveB_0)
  {
    __compactRuntime.assert(currentReserveA_0 > 0n && currentReserveB_0 > 0n,
                            'E_NO_LIQ');
    const effectiveIn_0 = this.__effectiveAmountIn_0(context,
                                                     partialProofData,
                                                     amountIn_0);
    __compactRuntime.assert(effectiveIn_0 > 0n, 'E_TRADE_SMALL');
    const totalFee_0 = this.__subU64_0(amountIn_0, effectiveIn_0);
    __compactRuntime.assert(protocolFee_0 <= totalFee_0, 'E_PROTOCOL_FEE');
    const reserveAmountIn_0 = this.__subU64_0(amountIn_0, protocolFee_0);
    const denominator_0 = this.__addU64_0(currentReserveB_0, effectiveIn_0);
    const numerator_0 = effectiveIn_0 * currentReserveA_0;
    const amountOut_0 = this.__divU128ByU64Checked_0(context,
                                                     partialProofData,
                                                     numerator_0,
                                                     denominator_0);
    __compactRuntime.assert(amountOut_0 > 0n, 'E_ZERO_OUT');
    __compactRuntime.assert(amountOut_0 >= minOut_0, 'E_MIN_OUT');
    return { reserveAmountIn: reserveAmountIn_0, amountOut: amountOut_0 };
  }
  __divU128ByU64Checked_0(context, partialProofData, dividend_0, divisor_0) {
    __compactRuntime.assert(divisor_0 > 0n, 'E_DIV_0');
    const divResult_0 = this._wit_divU128ByU64_0(context,
                                                 partialProofData,
                                                 dividend_0,
                                                 divisor_0);
    const quotient_0 = divResult_0.quotient;
    const remainder_0 = divResult_0.remainder;
    __compactRuntime.assert(remainder_0 < divisor_0, 'E_DIV_REM');
    const productField_0 = __compactRuntime.mulField(quotient_0, divisor_0);
    const recomposedField_0 = __compactRuntime.addField(productField_0,
                                                        remainder_0);
    __compactRuntime.assert(recomposedField_0 === dividend_0, 'E_DIV_WIT');
    return quotient_0;
  }
  __ceilDivU128ByU64Checked_0(context, partialProofData, dividend_0, divisor_0)
  {
    __compactRuntime.assert(divisor_0 > 0n, 'E_DIV_0');
    const quotient_0 = this.__divU128ByU64Checked_0(context,
                                                    partialProofData,
                                                    dividend_0,
                                                    divisor_0);
    const product_0 = quotient_0 * divisor_0;
    if (this._equal_46(product_0, dividend_0)) {
      return quotient_0;
    } else {
      return this.__addU64_0(quotient_0, 1n);
    }
  }
  __floorDivU128ByU64FitsU64_0(dividend_0, divisor_0) {
    const quotientProduct_0 = this.__maxU64_0() * divisor_0;
    const exclusiveUpperBound_0 = ((t1) => {
                                    if (t1 > 340282366920938463463374607431768211455n) {
                                      throw new __compactRuntime.CompactError('contract.compact line 1214 char 31: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                                    }
                                    return t1;
                                  })(quotientProduct_0 + divisor_0);
    return divisor_0 > 0n && dividend_0 < exclusiveUpperBound_0;
  }
  __ceilDivU128ByU64FitsU64_0(dividend_0, divisor_0) {
    __compactRuntime.assert(divisor_0 > 0n, 'E_DIV_0');
    const maxDividend_0 = this.__maxU64_0() * divisor_0;
    return dividend_0 <= maxDividend_0;
  }
  __sqrtU128Floor_0(context, partialProofData, value_0) {
    const root_0 = this._wit_sqrtU128_0(context, partialProofData, value_0);
    const rootSquared_0 = root_0 * root_0;
    __compactRuntime.assert(rootSquared_0 <= value_0, 'E_SQRT_LOW');
    if (!this._equal_47(root_0, this.__maxU64_0())) {
      const next_0 = this.__addU64_0(root_0, 1n);
      const nextSquared_0 = next_0 * next_0;
      __compactRuntime.assert(nextSquared_0 > value_0, 'E_SQRT_HIGH');
    }
    return root_0;
  }
  __burnUserAddress_0() {
    return { bytes:
               new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) };
  }
  __assertLiveDeadline_0(context, partialProofData, deadline_0) {
    __compactRuntime.assert(this._blockTimeLte_0(context,
                                                 partialProofData,
                                                 deadline_0),
                            'E_DEADLINE');
    return [];
  }
  __assertMaxOrderDeadline_0(context, partialProofData, deadline_0) {
    if (deadline_0 >= this.__maxOrderTtlCheckWindowSeconds_0()) {
      __compactRuntime.assert(this._blockTimeGt_0(context,
                                                  partialProofData,
                                                  this.__subU64_0(deadline_0,
                                                                  this.__maxOrderTtlCheckWindowSeconds_0())),
                              'E_TTL');
    }
    return [];
  }
  __assertMaxLiquidityOrderDeadline_0(context, partialProofData, deadline_0) {
    if (deadline_0 >= 5184001n) {
      __compactRuntime.assert(this._blockTimeGt_0(context,
                                                  partialProofData,
                                                  this.__subU64_0(deadline_0,
                                                                  5184001n)),
                              'E_LIQ_TTL');
    }
    return [];
  }
  __assertCancelSecret_0(context,
                         partialProofData,
                         expectedCommitment_0,
                         orderId_0)
  {
    __compactRuntime.assert(this._equal_48(this.__cancelCommitment_0(context,
                                                                     partialProofData,
                                                                     orderId_0),
                                           expectedCommitment_0),
                            'E_CANCEL_SECRET');
    return [];
  }
  __assertCancelSecretOrExpired_0(context,
                                  partialProofData,
                                  expectedCommitment_0,
                                  orderId_0,
                                  deadline_0)
  {
    if (this._blockTimeGt_0(context, partialProofData, deadline_0)) {
      return [];
    } else {
      this.__assertCancelSecret_0(context,
                                  partialProofData,
                                  expectedCommitment_0,
                                  orderId_0);
      return [];
    }
  }
  __cancelCommitment_0(context, partialProofData, orderId_0) {
    return this._persistentHash_0([this.__cancelAuthDomain_0(),
                                   orderId_0,
                                   this.__nonzeroCancelSecret_0(context,
                                                                partialProofData)]);
  }
  __nonzeroCancelSecret_0(context, partialProofData) {
    const secret_0 = this._cancelSecret_0(context, partialProofData);
    __compactRuntime.assert(!this._equal_49(secret_0, new Uint8Array(32)),
                            'E_CANCEL_0');
    return secret_0;
  }
  __cancelAuthDomain_0() {
    return new Uint8Array([66, 83, 86, 51, 51, 95, 67, 65, 78, 67, 69, 76, 95, 65, 85, 84, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  __callerDeployerAuthId_0(context, partialProofData) {
    return this.__authIdForSecret_0(new Uint8Array([66, 83, 86, 51, 51, 95, 68, 69, 80, 76, 79, 89, 69, 82, 95, 65, 85, 84, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    this.__nonzeroLocalSk_0(context,
                                                            partialProofData));
  }
  __callerMasterAuthId_0(context, partialProofData) {
    return this.__authIdForSecret_0(this.__masterAuthDomain_0(),
                                    this.__nonzeroLocalSk_0(context,
                                                            partialProofData));
  }
  __callerBatcherAuthId_0(context, partialProofData) {
    return this.__authIdForSecret_0(this.__batcherAuthDomain_0(),
                                    this.__nonzeroLocalSk_0(context,
                                                            partialProofData));
  }
  __authIdForSecret_0(domain_0, secret_0) {
    return this._persistentHash_1([domain_0, secret_0]);
  }
  __nonzeroLocalSk_0(context, partialProofData) {
    const sk_0 = this._localSk_0(context, partialProofData);
    __compactRuntime.assert(!this._equal_50(sk_0, new Uint8Array(32)),
                            'E_LOCAL_SK_0');
    return sk_0;
  }
  __masterAuthDomain_0() {
    return new Uint8Array([66, 83, 86, 51, 51, 95, 77, 65, 83, 84, 69, 82, 95, 65, 85, 84, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  __batcherAuthDomain_0() {
    return new Uint8Array([66, 83, 86, 51, 51, 95, 66, 65, 84, 67, 72, 69, 82, 95, 65, 85, 84, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  __orderBondColor_0(context, partialProofData) {
    return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  __orderBondAmount_0(context, partialProofData) {
    return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_2.toValue(2n),
                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  __maxOrderTtlSeconds_0() { return 2592000n; }
  __maxOrderTtlCheckWindowSeconds_0() {
    return this.__addU64_0(this.__maxOrderTtlSeconds_0(), 1n);
  }
  __minSwapAmount_0() { return 1000n; }
  __effectiveAmountIn_0(context, partialProofData, amountIn_0) {
    const feeComplement_0 = this.__subU64_0(this.__maxFeeDenominator_0(),
                                            _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_2.toValue(0n),
                                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value));
    const numerator_0 = amountIn_0 * feeComplement_0;
    return this.__divU128ByU64Checked_0(context,
                                        partialProofData,
                                        numerator_0,
                                        this.__maxFeeDenominator_0());
  }
  __protocolFeeRecipient_0(context, partialProofData) {
    return { bytes:
               _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(3n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value) };
  }
  __protocolFeeForAmount_0(context, partialProofData, amountIn_0) {
    const effective_0 = this.__effectiveAmountIn_0(context,
                                                   partialProofData,
                                                   amountIn_0);
    const totalFee_0 = this.__subU64_0(amountIn_0, effective_0);
    const protocolFeeNumerator_0 = totalFee_0
                                   *
                                   _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(1n),
                                                                                                                         alignment: _descriptor_2.alignment() } },
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_2.toValue(4n),
                                                                                                                         alignment: _descriptor_2.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value);
    return this.__divU128ByU64Checked_0(context,
                                        partialProofData,
                                        protocolFeeNumerator_0,
                                        this.__maxFeeDenominator_0());
  }
  __knownLiabilityA_0(context, partialProofData) {
    return this.__addU128_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(9n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(5n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value));
  }
  __knownLiabilityB_0(context, partialProofData) {
    return this.__addU128_0(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(10n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(6n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value));
  }
  __assertAggregateOutputCoverage_0(context,
                                    partialProofData,
                                    tokenAOut_0,
                                    tokenBOut_0,
                                    bondOut_0)
  {
    this.__assertCoverageForColor_0(context,
                                    partialProofData,
                                    _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(0n),
                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(1n),
                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value),
                                    this.__knownLiabilityA_0(context,
                                                             partialProofData),
                                    this.__scheduledOutForColor_0(context,
                                                                  partialProofData,
                                                                  _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_2.toValue(0n),
                                                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  tokenAOut_0,
                                                                  tokenBOut_0,
                                                                  bondOut_0));
    this.__assertCoverageForColor_0(context,
                                    partialProofData,
                                    _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                              partialProofData,
                                                                                              [
                                                                                               { dup: { n: 0 } },
                                                                                               { idx: { cached: false,
                                                                                                        pushPath: false,
                                                                                                        path: [
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(0n),
                                                                                                                          alignment: _descriptor_2.alignment() } },
                                                                                                               { tag: 'value',
                                                                                                                 value: { value: _descriptor_2.toValue(2n),
                                                                                                                          alignment: _descriptor_2.alignment() } }] } },
                                                                                               { popeq: { cached: false,
                                                                                                          result: undefined } }]).value),
                                    this.__knownLiabilityB_0(context,
                                                             partialProofData),
                                    this.__scheduledOutForColor_0(context,
                                                                  partialProofData,
                                                                  _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                            partialProofData,
                                                                                                                            [
                                                                                                                             { dup: { n: 0 } },
                                                                                                                             { idx: { cached: false,
                                                                                                                                      pushPath: false,
                                                                                                                                      path: [
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_2.toValue(0n),
                                                                                                                                                        alignment: _descriptor_2.alignment() } },
                                                                                                                                             { tag: 'value',
                                                                                                                                               value: { value: _descriptor_2.toValue(2n),
                                                                                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                                                                                             { popeq: { cached: false,
                                                                                                                                        result: undefined } }]).value),
                                                                  tokenAOut_0,
                                                                  tokenBOut_0,
                                                                  bondOut_0));
    if (!this._equal_51(this.__orderBondColor_0(context, partialProofData),
                        _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(0n),
                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(1n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value))
        &&
        !this._equal_52(this.__orderBondColor_0(context, partialProofData),
                        _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(0n),
                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(2n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value)))
    {
      this.__assertCoverageForColor_0(context,
                                      partialProofData,
                                      this.__orderBondColor_0(context,
                                                              partialProofData),
                                      0n,
                                      this.__scheduledOutForColor_0(context,
                                                                    partialProofData,
                                                                    this.__orderBondColor_0(context,
                                                                                            partialProofData),
                                                                    tokenAOut_0,
                                                                    tokenBOut_0,
                                                                    bondOut_0));
    }
    return [];
  }
  __scheduledOutForColor_0(context,
                           partialProofData,
                           color_0,
                           tokenAOut_0,
                           tokenBOut_0,
                           bondOut_0)
  {
    const withTokenA_0 = this.__addIfSameColor_0(0n,
                                                 color_0,
                                                 _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(0n),
                                                                                                                                       alignment: _descriptor_2.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(1n),
                                                                                                                                       alignment: _descriptor_2.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 tokenAOut_0);
    const withTokenB_0 = this.__addIfSameColor_0(withTokenA_0,
                                                 color_0,
                                                 _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                           partialProofData,
                                                                                                           [
                                                                                                            { dup: { n: 0 } },
                                                                                                            { idx: { cached: false,
                                                                                                                     pushPath: false,
                                                                                                                     path: [
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(0n),
                                                                                                                                       alignment: _descriptor_2.alignment() } },
                                                                                                                            { tag: 'value',
                                                                                                                              value: { value: _descriptor_2.toValue(2n),
                                                                                                                                       alignment: _descriptor_2.alignment() } }] } },
                                                                                                            { popeq: { cached: false,
                                                                                                                       result: undefined } }]).value),
                                                 tokenBOut_0);
    return this.__addIfSameColor_0(withTokenB_0,
                                   color_0,
                                   this.__orderBondColor_0(context,
                                                           partialProofData),
                                   bondOut_0);
  }
  __addIfSameColor_0(total_0, targetColor_0, outputColor_0, amount_0) {
    if (this._equal_53(targetColor_0, outputColor_0)) {
      return this.__addU128_0(total_0, amount_0);
    } else {
      return total_0;
    }
  }
  __assertCoverageForColor_0(context,
                             partialProofData,
                             color_0,
                             baseLiability_0,
                             scheduledOut_0)
  {
    const required_0 = this.__addU128_0(baseLiability_0, scheduledOut_0);
    this.__assertCoverageAmountFitsRuntime_0(required_0);
    __compactRuntime.assert(this._unshieldedBalanceGte_0(context,
                                                         partialProofData,
                                                         color_0,
                                                         required_0),
                            'E_COVERAGE');
    return [];
  }
  __assertIncomingOrderAmountsFitRuntime_0(context,
                                           partialProofData,
                                           tokenAIn_0,
                                           tokenBIn_0,
                                           bondIn_0)
  {
    const tokenAIncoming_0 = this.__scheduledOutForColor_0(context,
                                                           partialProofData,
                                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                     partialProofData,
                                                                                                                     [
                                                                                                                      { dup: { n: 0 } },
                                                                                                                      { idx: { cached: false,
                                                                                                                               pushPath: false,
                                                                                                                               path: [
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(0n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                                      { popeq: { cached: false,
                                                                                                                                 result: undefined } }]).value),
                                                           tokenAIn_0,
                                                           tokenBIn_0,
                                                           bondIn_0);
    const tokenBIncoming_0 = this.__scheduledOutForColor_0(context,
                                                           partialProofData,
                                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                     partialProofData,
                                                                                                                     [
                                                                                                                      { dup: { n: 0 } },
                                                                                                                      { idx: { cached: false,
                                                                                                                               pushPath: false,
                                                                                                                               path: [
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(0n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                                      { tag: 'value',
                                                                                                                                        value: { value: _descriptor_2.toValue(2n),
                                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                                      { popeq: { cached: false,
                                                                                                                                 result: undefined } }]).value),
                                                           tokenAIn_0,
                                                           tokenBIn_0,
                                                           bondIn_0);
    this.__assertCoverageAmountFitsRuntime_0(tokenAIncoming_0);
    this.__assertCoverageAmountFitsRuntime_0(tokenBIncoming_0);
    if (!this._equal_54(this.__orderBondColor_0(context, partialProofData),
                        _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(0n),
                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(1n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value))
        &&
        !this._equal_55(this.__orderBondColor_0(context, partialProofData),
                        _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(0n),
                                                                                                              alignment: _descriptor_2.alignment() } },
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_2.toValue(2n),
                                                                                                              alignment: _descriptor_2.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value)))
    {
      const bondIncoming_0 = this.__scheduledOutForColor_0(context,
                                                           partialProofData,
                                                           this.__orderBondColor_0(context,
                                                                                   partialProofData),
                                                           tokenAIn_0,
                                                           tokenBIn_0,
                                                           bondIn_0);
      this.__assertCoverageAmountFitsRuntime_0(bondIncoming_0);
    }
    return [];
  }
  __assertCoverageAmountFitsRuntime_0(amount_0) {
    __compactRuntime.assert(amount_0 <= this.__maxU64_0(), 'E_U64_BOUND');
    return [];
  }
  __assertKnownLpCoverage_0(context, partialProofData, extraOut_0) {
    __compactRuntime.assert(this._unshieldedBalanceGte_0(context,
                                                         partialProofData,
                                                         _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                                   partialProofData,
                                                                                                                   [
                                                                                                                    { dup: { n: 0 } },
                                                                                                                    { idx: { cached: false,
                                                                                                                             pushPath: false,
                                                                                                                             path: [
                                                                                                                                    { tag: 'value',
                                                                                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                                                                                               alignment: _descriptor_2.alignment() } },
                                                                                                                                    { tag: 'value',
                                                                                                                                      value: { value: _descriptor_2.toValue(7n),
                                                                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                                                                    { popeq: { cached: false,
                                                                                                                               result: undefined } }]).value),
                                                         extraOut_0),
                            'E_LP_COVERAGE');
    return [];
  }
  __burnLp_0(context, partialProofData, amount_0) {
    if (this._equal_56(amount_0, 0n)) {
      return [];
    } else {
      this.__assertKnownLpCoverage_0(context, partialProofData, amount_0);
      this.__sendToUser_0(context,
                          partialProofData,
                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                    partialProofData,
                                                                                    [
                                                                                     { dup: { n: 0 } },
                                                                                     { idx: { cached: false,
                                                                                              pushPath: false,
                                                                                              path: [
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(1n),
                                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                                     { tag: 'value',
                                                                                                       value: { value: _descriptor_2.toValue(7n),
                                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                                     { popeq: { cached: false,
                                                                                                result: undefined } }]).value),
                          amount_0,
                          this.__burnUserAddress_0());
      return [];
    }
  }
  __minimumLiquidity_0() { return 1n; }
  __isZeroBytes32_0(value_0) {
    return this._equal_57(value_0,
                          new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  __sameUserAddress_0(leftAddress_0, rightAddress_0) {
    return this._equal_58(leftAddress_0.bytes, rightAddress_0.bytes);
  }
  __addU64_0(a_0, b_0) {
    const sum_0 = a_0 + b_0;
    __compactRuntime.assert(sum_0 <= this.__maxU64_0(), 'E_U64_ADD');
    return ((t1) => {
             if (t1 > 18446744073709551615n) {
               throw new __compactRuntime.CompactError('contract.compact line 1499 char 10: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
             }
             return t1;
           })(sum_0);
  }
  __addU128_0(a_0, b_0) {
    const sum_0 = ((t1) => {
                    if (t1 > 340282366920938463463374607431768211455n) {
                      throw new __compactRuntime.CompactError('contract.compact line 1503 char 15: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                    }
                    return t1;
                  })(a_0 + b_0);
    __compactRuntime.assert(sum_0 >= a_0, 'E_U128_ADD'); return sum_0;
  }
  __subU64_0(a_0, b_0) {
    __compactRuntime.assert(a_0 >= b_0, 'E_U64_SUB');
    __compactRuntime.assert(a_0 >= b_0,
                            'result of subtraction would be negative');
    return a_0 - b_0;
  }
  __maxFeeDenominator_0() { return 10000n; }
  __assertMasterActionNonce_0(context, partialProofData, expected_0) {
    __compactRuntime.assert(this._equal_59(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(1n),
                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(13n),
                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value),
                                           expected_0),
                            'E_MASTER_NONCE');
    __compactRuntime.assert(expected_0 < this.__maxU64_0(), 'E_MASTER_NONCE_MAX');
    return [];
  }
  __assertMasterWallet_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_60(this.__callerMasterAuthId_0(context,
                                                                       partialProofData),
                                           _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() } },
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'E_MASTER');
    return [];
  }
  __assertAuthorizedBatcher_0(context, partialProofData) {
    __compactRuntime.assert(this.__isAuthorizedBatcher_0(context,
                                                         partialProofData,
                                                         this.__callerBatcherAuthId_0(context,
                                                                                      partialProofData)),
                            'E_BATCHER');
    return [];
  }
  __isAuthorizedBatcher_0(context, partialProofData, batcherAuthId_0) {
    if (!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_2.toValue(1n),
                                                                                               alignment: _descriptor_2.alignment() } },
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_2.toValue(12n),
                                                                                               alignment: _descriptor_2.alignment() } }] } },
                                                                    { push: { storage: false,
                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(batcherAuthId_0),
                                                                                                                           alignment: _descriptor_1.alignment() }).encode() } },
                                                                    'member',
                                                                    { popeq: { cached: true,
                                                                               result: undefined } }]).value))
    {
      return false;
    } else {
      return this._equal_61(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(1n),
                                                                                                                  alignment: _descriptor_2.alignment() } },
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_2.toValue(12n),
                                                                                                                  alignment: _descriptor_2.alignment() } }] } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(batcherAuthId_0),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            1n);
    }
  }
  __setBatcherAuthorizationInternal_0(context,
                                      partialProofData,
                                      batcherAuthId_0,
                                      allowed_0)
  {
    if (allowed_0) {
      const tmp_0 = 1n;
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(1n),
                                                                    alignment: _descriptor_2.alignment() } },
                                                         { tag: 'value',
                                                           value: { value: _descriptor_2.toValue(12n),
                                                                    alignment: _descriptor_2.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(batcherAuthId_0),
                                                                                                alignment: _descriptor_1.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_0),
                                                                                                alignment: _descriptor_2.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 2 } }]);
      return [];
    } else {
      if (_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_2.toValue(1n),
                                                                                                alignment: _descriptor_2.alignment() } },
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_2.toValue(12n),
                                                                                                alignment: _descriptor_2.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(batcherAuthId_0),
                                                                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value))
      {
        __compactRuntime.queryLedgerState(context,
                                          partialProofData,
                                          [
                                           { idx: { cached: false,
                                                    pushPath: true,
                                                    path: [
                                                           { tag: 'value',
                                                             value: { value: _descriptor_2.toValue(1n),
                                                                      alignment: _descriptor_2.alignment() } },
                                                           { tag: 'value',
                                                             value: { value: _descriptor_2.toValue(12n),
                                                                      alignment: _descriptor_2.alignment() } }] } },
                                           { push: { storage: false,
                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(batcherAuthId_0),
                                                                                                  alignment: _descriptor_1.alignment() }).encode() } },
                                           { rem: { cached: false } },
                                           { ins: { cached: true, n: 2 } }]);
      }
      return [];
    }
  }
  __minLpFeeBps_0() { return 5n; }
  __maxLpFeeBps_0() { return 2000n; }
  __defaultProtocolFeeShareBps_0() { return 1667n; }
  __maxProtocolFeeShareBps_0() { return 2000n; }
  __maxU64_0() { return 18446744073709551615n; }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_11(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_13(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_14(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_15(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_16(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_17(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_18(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_19(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_20(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_21(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_22(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_23(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_24(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_25(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_26(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_27(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_28(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_29(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_30(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_31(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_32(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_33(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_34(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_35(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_36(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_37(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_38(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_39(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_40(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_41(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_42(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_43(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_44(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_45(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_46(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_47(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_48(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_49(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_50(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_51(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_52(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_53(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_54(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_55(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_56(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_57(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_58(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_59(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_60(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_61(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get masterAuthId() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get tokenTypeA() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get tokenTypeB() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(2n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get lpTokenDomain() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(3n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get lpFeeBps() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(0n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get orderBondTokenType() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get orderBondAmount() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(2n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get protocolFeeRecipientBytes() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(3n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get protocolFeeShareBps() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(4n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get claimableProtocolFeeA() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(5n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get claimableProtocolFeeB() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(6n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get lpTokenType() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(7n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get totalLPSupply() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(8n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get reserveA() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(9n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get reserveB() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(10n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    orderBook: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(11n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(11n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'contract.compact line 94 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(11n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'contract.compact line 94 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_10.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(1n),
                                                                                                      alignment: _descriptor_2.alignment() } },
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_2.toValue(11n),
                                                                                                      alignment: _descriptor_2.alignment() } }] } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_1.toValue(key_0),
                                                                                                      alignment: _descriptor_1.alignment() } }] } },
                                                                           { popeq: { cached: false,
                                                                                      result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[11];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_10.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    authorizedBatchers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(12n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(12n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'contract.compact line 95 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(12n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'contract.compact line 95 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(1n),
                                                                                                     alignment: _descriptor_2.alignment() } },
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_2.toValue(12n),
                                                                                                     alignment: _descriptor_2.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(key_0),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1].asArray()[12];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_2.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get masterActionNonce() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(13n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get deployerAuthId() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(1n),
                                                                                                   alignment: _descriptor_2.alignment() } },
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_2.toValue(14n),
                                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  wit_divU128ByU64: (...args) => undefined,
  wit_sqrtU128: (...args) => undefined,
  localSk: (...args) => undefined,
  cancelSecret: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
