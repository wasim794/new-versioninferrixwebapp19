import {MeshNodeDatasourceModel} from "../../shared/model/mesh-node-datasource.model";

export class ModbusSerialNodeDatasourceModel extends MeshNodeDatasourceModel<ModbusSerialNodeDatasourceModel> {
  public override modelType = 'MODBUS_SERIAL_MESH_NODE.DS';
  constructor(model?: Partial<ModbusSerialNodeDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
