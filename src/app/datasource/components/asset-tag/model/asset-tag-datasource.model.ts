import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class AssetTagDatasourceModel extends AbstractPollingDatasourceModel<AssetTagDatasourceModel> {
  public override modelType = 'STUDENT_ASSET_TAG.DS';

  constructor(model?: Partial<AssetTagDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
