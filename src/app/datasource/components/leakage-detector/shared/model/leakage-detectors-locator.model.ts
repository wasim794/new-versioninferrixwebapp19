import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class LeakageDetectorsModel extends PointLocatorModel<LeakageDetectorsModel> {
  public modelType = 'WATER_LEAKAGE_DETECTOR.PL';
  public attributeId!: string;

  constructor(model?: Partial<LeakageDetectorsModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
