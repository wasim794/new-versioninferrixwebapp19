import {BaseModbusConfigurationModel} from "../../../../core/models/dataSource";

export class ModbusIpConfigurationModel extends BaseModbusConfigurationModel {
  public type: string = "MODBUS_IP.CONFIG";
  public timeout: number = 0; // Initialized
  public retries: number = 0; // Initialized
  public transport: string = ''; // Initialized
  public host: string = ''; // Initialized
  public port: number = 0; // Initialized
  public encapsulated: boolean = false; // Initialized
  public dataSourceXid: string = ''; // Initialized

  constructor(model?: Partial<ModbusIpConfigurationModel>) {
    super(model);
    // Assign properties from the model if provided
    if (model) {
      Object.assign(this, model);
    }
  }

  public override toJson(): any {
    // super.toJson() is called but its return value is not used.
    // If BaseModbusConfigurationModel's toJson() returns a specific object,
    // you might want to merge it or use it.
    // For now, keeping the original logic which effectively deep clones 'this'.
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
