import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class InternalDatasourceLocatorModel extends PointLocatorModel<InternalDatasourceLocatorModel> {
  public modelType = 'INTERNAL.PL';
  public attributeId: string;

  constructor(model?: Partial<InternalDatasourceLocatorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
