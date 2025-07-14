import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class IaqSensorModel extends AbstractPollingDatasourceModel<IaqSensorModel> {
  public override modelType = 'SENSOR_TAG_IAQ_V.DS';

  constructor(model?: Partial<IaqSensorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
