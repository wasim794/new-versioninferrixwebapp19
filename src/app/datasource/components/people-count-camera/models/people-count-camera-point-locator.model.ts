import {PointLocatorModel} from "../../../../core/models/dataPoint";


export class PeopleCountCameraPointLocatorModel extends PointLocatorModel<PeopleCountCameraPointLocatorModel> {
  public modelType = 'PEOPLE_COUNT_CAMERA.PL';
  public ipAddress!: string;
  public timeout: number = 100;
  public attributeId! : string;

  constructor(model?: Partial<PeopleCountCameraPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }

}
