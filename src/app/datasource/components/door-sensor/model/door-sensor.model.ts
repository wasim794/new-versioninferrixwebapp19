import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class DoorSensorModel extends AbstractPollingDatasourceModel<DoorSensorModel> {
  public override modelType = 'DOOR_SENSOR.DS';

  constructor(model?: Partial<DoorSensorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
