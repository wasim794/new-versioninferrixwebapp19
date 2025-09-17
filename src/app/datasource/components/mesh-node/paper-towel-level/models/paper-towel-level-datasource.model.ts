import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";
import {MeshNodesDatasourceModel} from "../../../../../core/models/dataSource";

export class PaperTowelLevelDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType = 'PAPER_TOWEL_LEVEL_SENSOR.DS';

  constructor(model?: Partial<PaperTowelLevelDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
