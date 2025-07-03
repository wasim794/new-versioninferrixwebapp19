import {BaseModbusConfigurationModel} from "../../../../core/models/dataSource";

export class ModbusSerialConfigurationModel extends BaseModbusConfigurationModel {
  public type: string = "MODBUS_SERIAL.CONFIG";
  public ownerName!: string;
  public commPortId!: string;
  public baudRate!: number;
  public flowControlIn!: string;
  public flowControlOut!: string;
  public dataBits!: string;
  public stopBits!: string;
  public parity!: string;
  public encoding!: string;
  public timeout!: number;
  public retries!: number;

  constructor(model?: Partial<ModbusSerialConfigurationModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
