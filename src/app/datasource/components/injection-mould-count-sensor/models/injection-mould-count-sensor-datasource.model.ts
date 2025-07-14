import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

export class InjectionMouldCountSensorDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType: string = 'SENSOR_TAG_INJECTION_MOULD_COUNT.DS';

  constructor(model?: Partial<InjectionMouldCountSensorDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
