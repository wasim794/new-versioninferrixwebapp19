import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class MeshNodePointLocatorModel<T extends MeshNodePointLocatorModel<T>> extends PointLocatorModel<T> {
  public attributeId!: number;
  public type!: string;

  constructor(model?: Partial<T>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
