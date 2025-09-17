import {MeshNodeDatasourceModel} from "../../shared/model/mesh-node-datasource.model";

export class MetaDsNodeDatasourceModel extends MeshNodeDatasourceModel<MetaDsNodeDatasourceModel> {
  public override modelType = 'META_MESH_NODE.DS';
  constructor(model?: Partial<MetaDsNodeDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
