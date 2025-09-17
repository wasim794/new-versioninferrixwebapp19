import {MeshNodePointLocatorModel} from "../../shared/model/mesh-node-point-locator.model";

export class SnmpNodePointLocatorModel extends MeshNodePointLocatorModel<SnmpNodePointLocatorModel> {
  public modelType = 'SNMP_MESH_NODE.PL';
  constructor(model?: Partial<SnmpNodePointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    return super.toJson();
  }
}
