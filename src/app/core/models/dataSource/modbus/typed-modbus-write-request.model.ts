import {ModbusReadRequestModel} from "./modbus-read-request.model";

export class TypedModbusWriteRequestModel extends ModbusReadRequestModel {
  public data: any;
  public modbusDataType!: string;

  constructor(model ?: Partial<TypedModbusWriteRequestModel>) {
    super(model);
  }

  override toJson() {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
