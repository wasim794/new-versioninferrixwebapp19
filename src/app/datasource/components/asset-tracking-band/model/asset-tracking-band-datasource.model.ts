import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

export class AssetTrackingBandDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType = 'ASSET_TRACKING_BAND.DS';

  constructor(model?: Partial<AssetTrackingBandDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
