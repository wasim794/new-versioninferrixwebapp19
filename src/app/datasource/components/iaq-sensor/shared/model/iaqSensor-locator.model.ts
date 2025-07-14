import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class IaqSensorLocatorModel extends PointLocatorModel<IaqSensorLocatorModel> {
  public modelType = 'SENSOR_TAG_IAQ.PL';
  public attributeId!: string;

  constructor(model?: Partial<IaqSensorLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
