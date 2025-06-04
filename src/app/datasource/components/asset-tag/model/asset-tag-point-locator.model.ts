import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class AssetTagPointLocatorModel extends PointLocatorModel<AssetTagPointLocatorModel> {
  public modelType = 'STUDENT_ASSET_TAG.PL';
  public attributeId!: string;

  constructor(model?: Partial<AssetTagPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
