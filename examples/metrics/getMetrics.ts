import { Avalanche } from '../../src';
import { MetricsAPI } from '../../src/apis/metrics';

const ip: string = 'localhost';
const port: number = 9650;
const protocol: string = 'http';
const networkID: number = 12345;
const avalanche: Avalanche = new Avalanche(ip, port, protocol, networkID);
const metrics: MetricsAPI = avalanche.Metrics();

const main = async () => {
  const m: string = await metrics.getMetrics();
  console.log(m);
};

main();
