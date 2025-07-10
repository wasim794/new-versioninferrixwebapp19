import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class PeopleCounterDatasourceModel extends AbstractPollingDatasourceModel<PeopleCounterDatasourceModel> {
  public override modelType = 'PEOPLE_COUNTER.DS';

  constructor(model?: Partial<PeopleCounterDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
