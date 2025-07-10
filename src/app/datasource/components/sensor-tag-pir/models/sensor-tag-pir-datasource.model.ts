
import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

export class SensorTagPirDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType: string = 'SENSOR_TAG_TH_SHT45.DS';

  constructor(model?: Partial<SensorTagPirDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
