import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class AssetTrackingBandPointLocatorModel extends PointLocatorModel<AssetTrackingBandPointLocatorModel> {
  public modelType = 'ASSET_TRACKING_BAND.PL';
  public attributeId!: string;

  constructor(model?: Partial<AssetTrackingBandPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
