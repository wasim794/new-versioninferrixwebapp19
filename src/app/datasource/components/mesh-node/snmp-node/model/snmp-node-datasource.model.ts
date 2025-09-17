import {MeshNodeDatasourceModel} from "../../shared/model/mesh-node-datasource.model";

export class SnmpNodeDatasourceModel extends MeshNodeDatasourceModel<SnmpNodeDatasourceModel> {
  public override modelType = 'SNMP_MESH_NODE.DS';
  constructor(model?: Partial<SnmpNodeDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
