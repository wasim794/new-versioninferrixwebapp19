import {MeshNodePointLocatorModel} from "../../shared/model/mesh-node-point-locator.model";

export class BacnetIpNodePointLocatorModel extends MeshNodePointLocatorModel<BacnetIpNodePointLocatorModel> {
  public modelType = 'BACNET_IP_MESH_NODE.PL';
  constructor(model?: Partial<BacnetIpNodePointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
