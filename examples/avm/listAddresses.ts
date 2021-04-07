import {
  Avalanche,
} from '../../dist';
import { AVMAPI } from '../../src/apis/avm';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const xchain: AVMAPI = avalanche.XChain();

const main = async () => {
  const username: string = 'username';
  const password: string = 'Vz48jjHLTCcAepH95nT4B';
  const addresses: string[] = await xchain.listAddresses(username, password);
  console.log(addresses);
};

main();
