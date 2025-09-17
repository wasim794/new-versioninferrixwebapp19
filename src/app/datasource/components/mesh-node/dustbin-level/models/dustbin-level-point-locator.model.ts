import {PointLocatorModel} from "../../../../../core/models/dataPoint";


export class DustbinLevelPointLocatorModel extends PointLocatorModel<DustbinLevelPointLocatorModel> {
  public modelType = 'DUSTBIN_LEVEL_SENSOR.PL';
  public attributeId!: string

  constructor(model?: Partial<DustbinLevelPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
