import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class DistanceSensorModel extends AbstractPollingDatasourceModel<DistanceSensorModel> {
  public override modelType = 'DISTANCE_SENSOR.DS';

  constructor(model?: Partial<DistanceSensorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
