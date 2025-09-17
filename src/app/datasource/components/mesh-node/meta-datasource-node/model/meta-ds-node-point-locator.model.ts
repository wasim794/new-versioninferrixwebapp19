import {MeshNodePointLocatorModel} from "../../shared/model/mesh-node-point-locator.model";

export class MetaDsNodePointLocatorModel extends MeshNodePointLocatorModel<MetaDsNodePointLocatorModel> {
  public modelType = 'META_MESH_NODE.PL';
  constructor(model?: Partial<MetaDsNodePointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
