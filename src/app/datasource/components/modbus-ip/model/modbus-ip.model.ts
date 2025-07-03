import {ModbusDatasourceModel} from './modbus-datasource.model';
export class ModbusIpModel extends ModbusDatasourceModel<ModbusIpModel> {
  public transportType!: string;
  public host!: number;
  public port!: number;
  public encapsulated!: boolean
  public override modelType = 'MODBUS_IP.DS';
  constructor(model?: Partial<ModbusIpModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
