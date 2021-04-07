import { Avalanche } from '../../src';
import { KeystoreAPI } from '../../src/apis/keystore';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const keystore: KeystoreAPI = avalanche.NodeKeys();

const main = async () => {
  const users: string[] = await keystore.listUsers();
  console.log(users);
};

main();
