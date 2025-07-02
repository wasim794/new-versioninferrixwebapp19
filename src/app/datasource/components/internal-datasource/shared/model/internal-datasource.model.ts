import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class InternalDatasourceModel extends AbstractPollingDatasourceModel<InternalDatasourceModel> {
  public modelType = 'INTERNAL.DS';

  constructor(model?: Partial<InternalDatasourceModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
