import {AbstractPublisherModel} from "../../../../core/models/publisher";
import {IntegrationPointModel} from "./integration-point.model";

export class IntegrationSenderModel extends AbstractPublisherModel<IntegrationSenderModel> {
  public override modelType = 'INTEGRATION_MQTT_SENDER.PUB';
  public gateway!: boolean;
  public declare points: IntegrationPointModel[];

  constructor(model?: Partial<IntegrationSenderModel>) {
    super(model);

    if (model && model.points) {
      this.points = model.points.map((point) => new IntegrationPointModel(point));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
