/**
 * Common types that are imported by multiple modules.
 */

export type Headers = {
  Authorization?: string,
  [index:string] : string
};

export type Peer = {
  ip: string,
  publicIP: string,
  nodeID: string,
  version: string,
  lastSent: string,
  lastReceived: string,
  benched: any
};
