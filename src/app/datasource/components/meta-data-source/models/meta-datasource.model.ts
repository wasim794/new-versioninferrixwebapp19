import {AbstractDatasourceModel} from "../../../../core/models/dataSource";

export class MetaDatasourceModel extends AbstractDatasourceModel<MetaDatasourceModel> {
  public override modelType = 'META.DS';

  constructor(model: Partial<MetaDatasourceModel>) {
    super(model);
  }

  override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
