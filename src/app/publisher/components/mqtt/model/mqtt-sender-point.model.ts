import {AbstractPublisherPointModel} from "../../../../core/models/publisher";

export class MqttSenderPointModel extends AbstractPublisherPointModel<MqttSenderPointModel> {
  public modelType = 'MQTT_SENDER.POINT';
  constructor(model?: Partial<MqttSenderPointModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
