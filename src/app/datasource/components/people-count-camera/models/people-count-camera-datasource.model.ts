import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

export class PeopleCountCameraDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType = 'PEOPLE_COUNT_CAMERA.DS';


  constructor(model?: Partial<PeopleCountCameraDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
