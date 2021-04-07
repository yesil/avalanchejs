import {
  Avalanche,
} from '../../dist';
import { AdminAPI } from '../../src/apis/admin';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const admin: AdminAPI = avalanche.Admin();

const main = async () => {
  const successful: boolean = await admin.lockProfile();
  console.log(successful);
};

main();
