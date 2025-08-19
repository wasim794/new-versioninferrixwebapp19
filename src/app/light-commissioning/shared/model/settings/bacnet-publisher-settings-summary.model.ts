export class BacnetPublisherSettingsSummaryModel {
  public lightNodesOnBacnet!: number;
  public luxSensorsOnBacnet!: number;
  public enoceanSwitchesOnBacnet!: number;
  public virtualSwitchesOnBacnet!: number;

  constructor(model?: Partial<BacnetPublisherSettingsSummaryModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
