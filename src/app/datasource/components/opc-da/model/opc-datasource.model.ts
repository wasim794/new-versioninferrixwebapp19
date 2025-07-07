import {
  AbstractPollingDatasourceModel
} from "../../../../core/models/dataSource/abstract-polling-datasource.model";

export class OpcDatasourceModel extends AbstractPollingDatasourceModel<OpcDatasourceModel> {

  public host!: string;
  public domain!: string;
  public user!: string;
  public password!: string;
  public server!: string;
  public override modelType = 'OPC.DS';

  constructor(model?: Partial<OpcDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
