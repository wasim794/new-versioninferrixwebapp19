import {MeshNodePointLocatorModel} from "../../shared/model/mesh-node-point-locator.model";

export class VirtualNodePointLocatorModel extends MeshNodePointLocatorModel<VirtualNodePointLocatorModel> {
  public modelType = 'VIRTUAL_MESH_NODE.PL';
  constructor(model?: Partial<VirtualNodePointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
