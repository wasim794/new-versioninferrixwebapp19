import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class LightDiControllerLocatorModel extends PointLocatorModel<LightDiControllerLocatorModel> {
  public modelType = 'LIGHT_CONTROLLER_V4.PL';
  public attributeId!: string;

  constructor(model?: Partial<LightDiControllerLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
