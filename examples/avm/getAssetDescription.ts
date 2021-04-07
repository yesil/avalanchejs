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
  const assetDescription: any = await xchain.getAssetDescription('AVAX');
  console.log(assetDescription);
};

main();
