export class MqttConfigurationModel {
  brokerUri!: string;
  x509CaCrt!: string;
  x509ClientCrt!: string;
  privateKey!: string;
  awsIot!: boolean;
  clientId!: string;
  userName!: string;
  userPassword!: string;
  topicFilters!: string;
  autoReconnect!: boolean;
  cleanSession!: boolean;
  keepAliveInterval!: number;
  connectionTimeout!: number;
  qosType!: string;
  publishTopic!: string;
  subscribeTopic!: string;

  constructor(model?: Partial<MqttConfigurationModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }

}
