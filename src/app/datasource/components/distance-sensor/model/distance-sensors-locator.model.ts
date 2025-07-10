import {PointLocatorModel} from "../../../../core/models/dataPoint";
import {DistanceSensorModel} from "./distance-sensor.model";

export class DistanceSensorsLocatorModel extends PointLocatorModel<DistanceSensorsLocatorModel> {
  public modelType = 'DISTANCE_SENSOR.PL';
  public attributeId!: string;

  constructor(model?: Partial<DistanceSensorsLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
