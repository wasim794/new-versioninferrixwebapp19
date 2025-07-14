import {AbstractPollingDatasourceModel} from "../../../../../core/models/dataSource/abstract-polling-datasource.model";

export class LeakageDetectorModel extends AbstractPollingDatasourceModel<LeakageDetectorModel> {
  public override modelType = 'WATER_LEAKAGE_DETECTOR.DS';

  constructor(model?: Partial<LeakageDetectorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
