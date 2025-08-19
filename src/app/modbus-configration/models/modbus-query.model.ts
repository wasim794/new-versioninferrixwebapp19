import {BasicModel} from "../../core/models";

export class ModbusQueryModel extends BasicModel<ModbusQueryModel> {
  slaveId: number;
  definition: string;
  deviceAttribute: string;
  interval: number;
  oneTime: boolean;
  readPermission: string;
  editPermission: string;

  constructor(model?: Partial<ModbusQueryModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
