import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class LightControllerV4LocatorModel extends PointLocatorModel<LightControllerV4LocatorModel> {
  public modelType = 'LIGHT_CONTROLLER_V4.PL';
  public attributeId!: string;

  constructor(model?: Partial<LightControllerV4LocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
