import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

export class CurrentSensorDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType = 'CURRENT_SENSOR.DS';


  constructor(model?: Partial<CurrentSensorDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
