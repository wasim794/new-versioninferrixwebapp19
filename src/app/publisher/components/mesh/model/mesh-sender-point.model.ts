import {AbstractPublisherPointModel} from "../../../../core/models/publisher";

export class MeshSenderPointModel extends AbstractPublisherPointModel<MeshSenderPointModel> {
  public modelType = 'MESH_SENDER.POINT';
  public attributeId!: number;
  public type!: string;
  public settable!: boolean;

  constructor(model?: Partial<MeshSenderPointModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
