export class BacnetLocalDeviceModel<T>{
  public id!: string;
  public deviceId!: number;
  public deviceName!: string;
  public localNetworkNumber!: number;
  public timeout!: number;
  public segTimeout!: number;
  public segWindow!: number;
  public retries!: number;
  public type!: string;
  localBindAddress: any;
  broadcastAddress: any;
  subnet: any;
  reuseAddress: any;
  port: any;
  foreignBBMDAddress: any;
  useRealtime: any;
  configProgramLocation: any;
  driverFileLocation: any;
  responseTimeoutMs: any;
  usageTimeout: any;
  maxInfoFrames: any;
  maxMaster: any;
  retryCount: any;
  thisStation: any;
  baudRate: any;
  commPortId: any;
  foreignBBMDTimeToLive: any;
  foreignBBMDPort: any;

  constructor(model?: Partial<T>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
