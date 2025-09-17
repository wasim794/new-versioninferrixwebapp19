import {AbstractDatasourceModel} from "../../../../../core/models/dataSource";

export class MeshNodeDatasourceModel<T extends MeshNodeDatasourceModel<T>> extends AbstractDatasourceModel<T> {
  public controllerAddress!: number;
  public publisherId!: number;

  constructor(model?: Partial<T>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
