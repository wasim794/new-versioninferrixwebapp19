import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class InjectionMouldCountSensorPointLocatorModel extends PointLocatorModel<InjectionMouldCountSensorPointLocatorModel> {
  public modelType = 'SENSOR_TAG_INJECTION_MOULD_COUNT.PL';
  public attributeId!: string;

  constructor(model?: Partial<InjectionMouldCountSensorPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
