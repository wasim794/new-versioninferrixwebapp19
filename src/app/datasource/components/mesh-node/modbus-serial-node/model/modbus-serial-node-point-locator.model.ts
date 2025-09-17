import {MeshNodePointLocatorModel} from "../../shared/model/mesh-node-point-locator.model";

export class ModbusSerialNodePointLocatorModel extends MeshNodePointLocatorModel<ModbusSerialNodePointLocatorModel> {
  public modelType = 'MODBUS_MESH_NODE.PL';
  constructor(model?: Partial<ModbusSerialNodePointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
