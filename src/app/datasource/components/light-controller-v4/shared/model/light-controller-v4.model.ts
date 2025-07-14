import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class LightControllerV4Model extends AbstractPollingDatasourceModel<LightControllerV4Model> {
  public override modelType = 'LIGHT_CONTROLLER_V4.DS';

  constructor(model?: Partial<LightControllerV4Model>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
