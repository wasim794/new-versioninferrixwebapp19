import {MeshNodeDatasourceModel} from "../../shared/model/mesh-node-datasource.model";

export class BacnetSerialNodeDatasourceModel extends MeshNodeDatasourceModel<BacnetSerialNodeDatasourceModel> {
  public override modelType = 'BACNET_MSTP_MESH_NODE.DS';

  constructor(model?: Partial<BacnetSerialNodeDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
