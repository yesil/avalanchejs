import Avalanche from '../../src/Avalanche';
import { InfoAPI } from '../../src/apis/info';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const info = new InfoAPI(avalanche);

const main = async (): Promise<any> => {
  const networkName : string = await info.getNetworkName();
  console.log(networkName);
};

main();
