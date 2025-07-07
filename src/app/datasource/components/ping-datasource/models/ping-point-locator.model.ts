import {PointLocatorModel} from "../../../../core/models/dataPoint";


export class PingPointLocatorModel extends PointLocatorModel<PingPointLocatorModel> {
  public modelType = 'PING.PL';
  public ipAddress!: string;
  public timeout: number = 100;

  constructor(model?: Partial<PingPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
