import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class PoeLightingDatasourceModel extends AbstractPollingDatasourceModel<PoeLightingDatasourceModel> {
  public override modelType = 'POE_LIGHTING.DS';
  public ipAddress!: string;
  public token!: string;
  public connectionTimeoutSeconds!: number;
  public retries!: number;

  constructor(model?: Partial<PoeLightingDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
