import {AbstractPublisherModel} from "../../../../core/models/publisher";
import {MeshSenderPointModel} from "./mesh-sender-point.model";

export class MeshSenderModel extends AbstractPublisherModel<MeshSenderModel> {
  public override modelType = 'MESH_SENDER.PUB';
  public declare points: MeshSenderPointModel[];

  constructor(model?: Partial<MeshSenderModel>) {
    super(model);

    if (model && model.points) {
      this.points = model.points.map((point) => new MeshSenderPointModel(point));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
