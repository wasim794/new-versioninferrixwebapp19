import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class SlBusPointLocatorModel extends PointLocatorModel<SlBusPointLocatorModel> {
  public modelType = 'SL_BUS.PL';
  public attributeId!: string;
  public slBusDeviceType!: string;
  public nodeAddress!: number;

  constructor(model?: Partial<SlBusPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
