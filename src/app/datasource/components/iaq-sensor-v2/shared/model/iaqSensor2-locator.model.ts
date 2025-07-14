import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class IaqSensor2LocatorModel extends PointLocatorModel<IaqSensor2LocatorModel> {
  public modelType = 'SENSOR_TAG_IAQ_V2.PL';
  public attributeId!: string;

  constructor(model?: Partial<IaqSensor2LocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
