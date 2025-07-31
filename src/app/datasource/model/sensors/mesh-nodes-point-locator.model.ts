import { PointLocatorModel } from '../pointLocatorModel';

export class MeshNodesPointLocatorModel extends PointLocatorModel {
  override modelType: string;
  attributeId!: string;
  subAttributeId!: string;

  constructor(modelType: string) {
    super();
    this.modelType = modelType;
  }
}
