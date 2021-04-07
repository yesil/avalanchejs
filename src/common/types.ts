import BN from 'bn.js';

/**
 * Common types that are imported by multiple modules.
 */

export type Headers = {
  Authorization?: string;
  Accept?: string;
  [index: string]: string | undefined;
};

export type Peer = {
  ip: string;
  publicIP: string;
  nodeID: string;
  version: string;
  lastSent: string;
  lastReceived: string;
  benched: any;
};

export type Network = {
  alias: string;
  blockchainID: string;
  chainID?: number;
  creationTxFee?: BN | number;
  fee?: BN;
  gasPrice?: BN | number;
  maxConsumption?: number;
  maxStakeDuration?: number;
  maxStakingDuration?: BN;
  maxSupply?: BN;
  minConsumption?: number;
  minDelegationFee?: BN;
  minDelegationStake?: BN;
  minStake?: BN;
  minStakeDuration?: number;
  txFee?: BN | number;
  vm: string;
};

export type NetworkType = {
  hrp: string,
  chains: {
    X: Network;
    P: Network;
    C: Network;
    [key: string]: Network;
  }
};
