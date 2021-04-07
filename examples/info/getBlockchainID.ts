import { Avalanche } from '../../src';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche = new Avalanche(ip, port, protocol, networkID);
const info = avalanche.Info();

const main = async () => {
  const alias: string = 'X';
  const blockchainID : string = await info.getBlockchainID(alias);
  console.log(blockchainID);
};

main();
