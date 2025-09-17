import {MeshNodesDatasourceModel} from "../../../../../core/models/dataSource";

export class DustbinLevelDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType = 'DUSTBIN_LEVEL_SENSOR.DS';

  constructor(model?: Partial<DustbinLevelDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
