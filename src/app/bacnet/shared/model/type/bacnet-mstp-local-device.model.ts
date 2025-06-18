import {BacnetLocalDeviceModel} from '../common/bacnet-local-device.model';

export class BacnetMstpLocalDeviceModel extends BacnetLocalDeviceModel<BacnetMstpLocalDeviceModel> {
   declare commPortId: string;
  declare baudRate: number;
  declare thisStation: number;
  declare retryCount: number;
  declare maxMaster: number;
  declare maxInfoFrames: number;
  declare usageTimeout: number;
  declare useRealtime: boolean;
  declare driverFileLocation: string;
  declare configProgramLocation: string;
  declare responseTimeoutMs: number;

  constructor(model?: Partial<BacnetMstpLocalDeviceModel>) {
    super(model);
  }

   override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
