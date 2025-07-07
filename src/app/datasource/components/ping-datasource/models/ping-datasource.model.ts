import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class PingDatasourceModel extends AbstractPollingDatasourceModel<PingDatasourceModel> {
  public override modelType = 'PING.DS';

  constructor(model?: Partial<PingDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
