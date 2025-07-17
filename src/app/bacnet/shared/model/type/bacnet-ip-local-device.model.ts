import {BacnetLocalDeviceModel} from '../common/bacnet-local-device.model';

export class BacnetIpLocalDeviceModel extends BacnetLocalDeviceModel<BacnetIpLocalDeviceModel> {
  override type = 'IP';
 declare localBindAddress: string;
  declare broadcastAddress: string;
  declare subnet: number;
  declare port: number;
  declare reuseAddress: boolean;
  declare foreignBBMDAddress: string;
  declare foreignBBMDPort: number;
  declare foreignBBMDTimeToLive: number;

  constructor(model?: Partial<BacnetIpLocalDeviceModel>) {
    super(model);
  }

  override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
