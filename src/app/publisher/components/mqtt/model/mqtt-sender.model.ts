import {AbstractPublisherModel} from "../../../../core/models/publisher";
import {HttpSenderPointModel} from "../../http";
import {MqttSenderPointModel} from "./mqtt-sender-point.model";

export class MqttSenderModel extends AbstractPublisherModel<MqttSenderModel> {
  public override modelType = 'MQTT_SENDER.PUB';
  public declare points: MqttSenderPointModel[];
  public brokerUri!: string;
  public x509CaCrt!: string;
  public x509ClientCrt!: string;
  public privateKey!: string;
  public awsIot!: boolean;
  public clientId!: string;
  public userName!: string;
  public userPassword!: string;
  public topicFilters!: string;
  public autoReconnect!: boolean;
  public cleanSession!: boolean;
  public keepAliveInterval!: number;
  public connectionTimeout!: number;
  public qosType!: string;
  public enableDiagnosticPublish!: boolean;
  public diagnosticPublishTopic!: string;
  public diagnosticPublishTopicType!: string;
  public diagnosticPublishQosType!: string;

  constructor(model?: Partial<MqttSenderModel>) {
    super(model);

    if (model && model.points) {
      this.points = model.points.map((point) => new MqttSenderPointModel(point));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
