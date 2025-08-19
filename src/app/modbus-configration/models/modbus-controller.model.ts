import {BasicModel} from "../../core/models";
import {ModbusControllerQueryMapping} from "./modbus-controller-query-mapping";

export class ModbusControllerModel extends BasicModel<ModbusControllerModel> {
  meshNodeId: number;
  dataSourceId: number;
  status: boolean;
  commissioned: boolean;
  editPermission: string;
  mappings: Array<ModbusControllerQueryMapping>;
  address: number;

  constructor(model?: Partial<ModbusControllerModel>) {
    super(model);

    if (this.mappings) {
      this.mappings = model.mappings.map((mapping) => new ModbusControllerQueryMapping(mapping));
    }
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
