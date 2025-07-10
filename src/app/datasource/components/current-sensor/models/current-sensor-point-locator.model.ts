import {PointLocatorModel} from "../../../../core/models/dataPoint";


export class CurrentSensorPointLocatorModel extends PointLocatorModel<CurrentSensorPointLocatorModel> {
  public modelType = 'CURRENT_SENSOR.PL';


  constructor(model?: Partial<CurrentSensorPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
