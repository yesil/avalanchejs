import { Avalanche } from '../../src';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const info = avalanche.Info();

const main = async () => {
  const actualNetworkID : number = await info.getNetworkID();
  console.log(actualNetworkID);
};

main();
