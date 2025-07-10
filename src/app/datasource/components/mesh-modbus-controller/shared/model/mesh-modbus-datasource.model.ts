import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class MeshModbusDatasourceModel extends AbstractPollingDatasourceModel<MeshModbusDatasourceModel> {
  public override modelType = 'MODBUS_CONTROLLER.DS';

  constructor(model?: Partial<MeshModbusDatasourceModel>) {
    super(model);
  }

  public override  toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
