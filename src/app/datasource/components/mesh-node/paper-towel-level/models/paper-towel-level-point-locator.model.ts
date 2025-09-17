import {PointLocatorModel} from "../../../../../core/models/dataPoint";


export class PaperTowelLevelPointLocatorModel extends PointLocatorModel<PaperTowelLevelPointLocatorModel> {
  public modelType = 'PAPER_TOWEL_LEVEL_SENSOR.PL';
  public attributeId!: string

  constructor(model?: Partial<PaperTowelLevelPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
