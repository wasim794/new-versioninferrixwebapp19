import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class IaqSensor2Model extends AbstractPollingDatasourceModel<IaqSensor2Model> {
  public override modelType = 'SENSOR_TAG_IAQ_V2.DS';

  constructor(model?: Partial<IaqSensor2Model>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
