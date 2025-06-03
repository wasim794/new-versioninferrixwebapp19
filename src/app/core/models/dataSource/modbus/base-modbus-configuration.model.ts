export class BaseModbusConfigurationModel {
  constructor(model?: Partial<BaseModbusConfigurationModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
