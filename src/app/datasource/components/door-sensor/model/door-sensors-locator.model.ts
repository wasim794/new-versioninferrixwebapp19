import {PointLocatorModel} from "../../../../core/models/dataPoint";
import {DoorSensorModel} from "./door-sensor.model";

export class DoorSensorDetectorsModel extends PointLocatorModel<DoorSensorDetectorsModel> {
  public modelType = 'DOOR_SENSOR.PL';
  public attributeId!: string;

  constructor(model?: Partial<DoorSensorDetectorsModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
