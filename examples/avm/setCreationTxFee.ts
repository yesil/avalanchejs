import {
  Avalanche,
  BN,
} from '../../dist';
import { AVMAPI } from '../../src/apis/avm';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const xchain: AVMAPI = avalanche.XChain();

const main = async () => {
  const fee: BN = new BN(507);
  await xchain.setCreationTxFee(fee);
  const txFee: BN = await xchain.getCreationTxFee();
  console.log(txFee);
};

main();
