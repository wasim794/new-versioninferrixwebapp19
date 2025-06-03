import {BaseModbusConfigurationModel} from "./base-modbus-configuration.model";

export class ModbusReadRequestModel {
  public slaveId!: number;
  public range!: string;
  public offset!: number;
  public length!: number;
  public configuration!: BaseModbusConfigurationModel;

  constructor(model?: Partial<ModbusReadRequestModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
