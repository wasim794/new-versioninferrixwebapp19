import {MeshNodePointLocatorModel} from "../../shared/model/mesh-node-point-locator.model";

export class ModbusIpNodePointLocatorModel extends MeshNodePointLocatorModel<ModbusIpNodePointLocatorModel> {
  public modelType = 'MODBUS_MESH_NODE.PL';
  constructor(model?: Partial<ModbusIpNodePointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
