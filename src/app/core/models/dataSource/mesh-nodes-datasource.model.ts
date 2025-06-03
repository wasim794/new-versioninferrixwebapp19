import {AbstractDatasourceModel} from "./abstract-datasource.model";

export class MeshNodesDatasourceModel extends AbstractDatasourceModel<MeshNodesDatasourceModel> {
  address!: number;
  zone!: string;
  anchorNode!: boolean;
  location!: string;

  constructor(model?: Partial<MeshNodesDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
