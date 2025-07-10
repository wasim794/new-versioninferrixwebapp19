import {AbstractPollingDatasourceModel} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class SlBusDatasourceModel extends AbstractPollingDatasourceModel<SlBusDatasourceModel> {
  public override modelType = 'SL_BUS.DS';
  public username!: string;
  public password!: string;
  public dlmAccessToken!: string;
  public uuid!: string;
  public localUrl!: string;

  constructor(model?: Partial<SlBusDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
