import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

export class DidocardDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType: string = '4DI_2DO_CARD.DS';

  constructor(model?: Partial<DidocardDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
