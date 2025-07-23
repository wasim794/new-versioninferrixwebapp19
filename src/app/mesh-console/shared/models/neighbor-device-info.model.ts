export class NeighborDeviceInfoModel {
  address: number;
  txPower: number;
  rssi: number;
  type: number;
  cbRxAttempts: number;
  cbRxFailures: number;

  constructor(model?: Partial<NeighborDeviceInfoModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
