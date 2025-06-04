import {PointLocatorModel} from '../pointLocatorModel';

export class MeshNodesPointLocatorModel extends PointLocatorModel {
  constructor(modelType: string) {
    super();
    this.modelType = modelType;
  }
  override modelType: string;
  attributeId!: string;
  subAttributeId!: string;
}
