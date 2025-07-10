import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class PeopleCounterLocatorModel extends PointLocatorModel<PeopleCounterLocatorModel> {
  public modelType = 'PEOPLE_COUNTER.PL';
  public attributeId!: string;

  constructor(model?: Partial<PeopleCounterLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
