import { Avalanche } from '../../src';
import { KeystoreAPI } from '../../src/apis/keystore';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const keystore: KeystoreAPI = avalanche.NodeKeys();

const main = async () => {
  const username: string = 'username';
  const password: string = 'Vz48jjHLTCcAepH95nT4B';
  const successful: boolean = await keystore.createUser(username, password);
  console.log(successful);
};

main();
