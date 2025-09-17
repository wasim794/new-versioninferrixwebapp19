import {MeshNodeDatasourceModel} from "../../shared/model/mesh-node-datasource.model";

export class VirtualNodeDatasourceModel extends MeshNodeDatasourceModel<VirtualNodeDatasourceModel> {
  public override modelType = 'VIRTUAL_MESH_NODE.DS';
  constructor(model?: Partial<VirtualNodeDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
