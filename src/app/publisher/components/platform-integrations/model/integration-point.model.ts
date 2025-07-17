import {AbstractPublisherPointModel} from "../../../../core/models/publisher";

export class IntegrationPointModel extends AbstractPublisherPointModel<IntegrationPointModel> {
  public modelType = 'INTEGRATION_MQTT_SENDER.POINT';
  public publishTopic!: string;
  public publishTopicType!: string;
  public publishQosType!: string;
  public subscribeTopic!: string;
  public subscribeTopicType!: string;

  constructor(model?: Partial<IntegrationPointModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
