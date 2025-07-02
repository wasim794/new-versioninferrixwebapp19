import {AbstractDatasourceModel} from "../../../../core/models/dataSource";

export class MetaDatasourceModel extends AbstractDatasourceModel<MetaDatasourceModel> {
  public modelType = 'META.DS';

  constructor(model: Partial<MetaDatasourceModel>) {
    super(model);
  }

  toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
