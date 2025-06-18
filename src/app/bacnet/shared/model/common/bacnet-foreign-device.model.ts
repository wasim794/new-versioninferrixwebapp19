export class BacnetForeignDeviceModel {
  public bbmdHost!: string;
  public bbmdPort!: number;
  public timeToLiveSeconds!: number;

  constructor(model?: Partial<BacnetForeignDeviceModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
