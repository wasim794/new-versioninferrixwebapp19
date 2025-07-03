import {ModbusDatasourceModel} from './modbus-datasource.model';

export class ModbusSerialModel extends ModbusDatasourceModel<ModbusSerialModel> {
  public commPortId!: string;
  public baudRate!: number;
  public flowControlIn!: string;
  public flowControlOut!: string;
  public dataBits!: string;
  public stopBits!: string;
  public parity!: string;
  public encoding!: string;
  public echo!: boolean;
  public override modelType = 'MODBUS_SERIAL.DS';

  constructor(model?: Partial<ModbusSerialModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
