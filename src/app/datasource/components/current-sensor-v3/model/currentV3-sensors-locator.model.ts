import {PointLocatorModel} from "../../../../core/models/dataPoint";
import {CurrentV3SensorModel} from "./currentV3-sensor.model";

export class CurrentV3SensorsLocatorModel extends PointLocatorModel<CurrentV3SensorsLocatorModel> {
  public modelType = 'CURRENT_SENSOR_V3.PL';
  public attributeId!: string;

  constructor(model?: Partial<CurrentV3SensorsLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
