export class ModbusControllerQueryMapping {
  modbusControllerId: number;
  modbusQueryId: number;
  queryId: number;
  dataSourceId: number;
  enabled: boolean

  constructor(model?: Partial<ModbusControllerQueryMapping>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
