import {ModbusReadRequestModel} from "./modbus-read-request.model";

export class ModbusWriteRequestModel extends ModbusReadRequestModel {
  public data: any;

  constructor(model ?: Partial<ModbusWriteRequestModel>) {
    super(model);
  }

  override toJson() {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
