/**
 * @packageDocumentation
 * @module Common-AssetAmount
 */

import { Buffer } from 'buffer/';
import BN from 'bn.js';
import { StandardTransferableOutput } from './output';
import { StandardTransferableInput } from './input';

/**
 * Class for managing asset amounts in the UTXOSet fee calcuation
 */
export class AssetAmount {
  // assetID that is amount is managing.
  protected assetID: Buffer = Buffer.alloc(32);

  // amount of this asset that should be sent.
  protected amount: BN = new BN(0);

  // burn is the amount of this asset that should be burned.
  protected burn: BN = new BN(0);

  // spent is the total amount of this asset that has been consumed.
  protected spent: BN = new BN(0);

  // stakeableLockSpent is the amount of this asset that has been consumed that
  // was locked.
  protected stakeableLockSpent: BN = new BN(0);

  // change is the excess amount of this asset that was consumed over the amount
  // requested to be consumed(amount + burn).
  protected change: BN = new BN(0);

  // stakeableLockChange is a flag to mark if the input that generated the
  // change was locked.
  protected stakeableLockChange: boolean = false;

  // finished is a convenience flag to track "spent >= amount + burn"
  protected finished: boolean = false;

  getAssetID = (): Buffer => this.assetID;

  getAssetIDString = (): string => this.assetID.toString('hex');

  getAmount = (): BN => this.amount;

  getSpent = (): BN => this.spent;

  getBurn = (): BN => this.burn;

  getChange = (): BN => this.change;

  getStakeableLockSpent = (): BN => this.stakeableLockSpent;

  getStakeableLockChange = (): boolean => this.stakeableLockChange;

  isFinished = (): boolean => this.finished;

  // spendAmount should only be called if this asset is still awaiting more
  // funds to consume.
  spendAmount = (amt: BN, stakeableLocked: boolean = false): boolean => {
    if (this.finished) {
      /* istanbul ignore next */
      throw new Error('Error - AssetAmount.spendAmount: attempted to spend '
        + 'excess funds');
    }
    this.spent = this.spent.add(amt);
    if (stakeableLocked) {
      this.stakeableLockSpent = this.stakeableLockSpent.add(amt);
    }

    const total: BN = this.amount.add(this.burn);
    if (this.spent.gte(total)) {
      this.change = this.spent.sub(total);
      if (stakeableLocked) {
        this.stakeableLockChange = true;
      }
      this.finished = true;
    }
    return this.finished;
  };

  constructor(assetID: Buffer, amount: BN, burn: BN) {
    this.assetID = assetID;
    this.amount = typeof amount === 'undefined' ? new BN(0) : amount;
    this.burn = typeof burn === 'undefined' ? new BN(0) : burn;
    this.spent = new BN(0);
    this.stakeableLockSpent = new BN(0);
    this.stakeableLockChange = false;
  }
}

export abstract class StandardAssetAmountDestination<TO extends StandardTransferableOutput, TI extends StandardTransferableInput> {
  protected amounts: Array<AssetAmount> = [];

  protected destinations: Array<Buffer> = [];

  protected senders: Array<Buffer> = [];

  protected changeAddresses: Array<Buffer> = [];

  protected amountkey: object = {};

  protected inputs: Array<TI> = [];

  protected outputs: Array<TO> = [];

  protected change: Array<TO> = [];

  // TODO: should this function allow for repeated calls with the same
  //       assetID?
  addAssetAmount = (assetID: Buffer, amount: BN, burn: BN) => {
    const aa: AssetAmount = new AssetAmount(assetID, amount, burn);
    this.amounts.push(aa);
    this.amountkey[aa.getAssetIDString()] = aa;
  };

  addInput = (input: TI) => {
    this.inputs.push(input);
  };

  addOutput = (output: TO) => {
    this.outputs.push(output);
  };

  addChange = (output: TO) => {
    this.change.push(output);
  };

  getAmounts = (): Array<AssetAmount> => this.amounts;

  getDestinations = (): Array<Buffer> => this.destinations;

  getSenders = (): Array<Buffer> => this.senders;

  getChangeAddresses = (): Array<Buffer> => this.changeAddresses;

  getAssetAmount = (assetHexStr: string): AssetAmount => this.amountkey[assetHexStr];

  assetExists = (assetHexStr: string): boolean => (assetHexStr in this.amountkey);

  getInputs = (): Array<TI> => this.inputs;

  getOutputs = (): Array<TO> => this.outputs;

  getChangeOutputs = (): Array<TO> => this.change;

  getAllOutputs = (): Array<TO> => this.outputs.concat(this.change);

  canComplete = (): boolean => {
    for (let i = 0; i < this.amounts.length; i++) {
      if (!this.amounts[i].isFinished()) {
        return false;
      }
    }
    return true;
  };

  constructor(destinations: Array<Buffer>, senders: Array<Buffer>, changeAddresses: Array<Buffer>) {
    this.destinations = destinations;
    this.changeAddresses = changeAddresses;
    this.senders = senders;
  }
}
