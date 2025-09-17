import {MeshNodeDatasourceModel} from "../../shared/model/mesh-node-datasource.model";

export class BacnetIpNodeDatasourceModel extends MeshNodeDatasourceModel<BacnetIpNodeDatasourceModel> {
  public override modelType = 'BACNET_IP_MESH_NODE.DS';
  constructor(model?: Partial<BacnetIpNodeDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
