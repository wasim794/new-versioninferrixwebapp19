import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class LightDiControllerModel extends AbstractPollingDatasourceModel<LightDiControllerModel> {
  public override modelType = 'LIGHT_RELAY_CONTROLLER.DS';

  constructor(model?: Partial<LightDiControllerModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
