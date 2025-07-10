import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class SensorTagPirPointLocatorModel extends PointLocatorModel<SensorTagPirPointLocatorModel> {
  public modelType = 'SENSOR_TAG_PIR.PL';
  public attributeId!: string;

  constructor(model?: Partial<SensorTagPirPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
