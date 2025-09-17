import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class PoeLightingPointLocatorModel extends PointLocatorModel<PoeLightingPointLocatorModel> {
  public modelType = 'POE_LIGHTING.PL';
  public pointType!: string;
  public channelId!: number;

  constructor(model?: Partial<PoeLightingPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
