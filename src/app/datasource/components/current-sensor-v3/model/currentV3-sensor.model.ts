import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class CurrentV3SensorModel extends AbstractPollingDatasourceModel<CurrentV3SensorModel> {
  public override modelType = 'CURRENT_SENSOR_V3.DS';

  constructor(model?: Partial<CurrentV3SensorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
