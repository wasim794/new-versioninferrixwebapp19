import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class DidocardPointLocatorModel extends PointLocatorModel<DidocardPointLocatorModel> {
  public modelType = '4DI_2DO_CARD.PL';
  public attributeId!: string;

  constructor(model?: Partial<DidocardPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
