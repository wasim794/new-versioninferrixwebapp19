import {MeshNodePointLocatorModel} from "../../shared/model/mesh-node-point-locator.model";

export class BacnetSerialNodePointLocatorModel extends MeshNodePointLocatorModel<BacnetSerialNodePointLocatorModel> {
  public modelType = 'BACNET_MSTP_MESH_NODE.PL';
  constructor(model?: Partial<BacnetSerialNodePointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
