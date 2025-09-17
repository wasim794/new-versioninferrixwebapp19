import {MeshNodeDatasourceModel} from "../../shared/model/mesh-node-datasource.model";

export class ModbusIpNodeDatasourceModel extends MeshNodeDatasourceModel<ModbusIpNodeDatasourceModel> {
  public override modelType = 'MODBUS_IP_MESH_NODE.DS';
  constructor(model?: Partial<ModbusIpNodeDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
