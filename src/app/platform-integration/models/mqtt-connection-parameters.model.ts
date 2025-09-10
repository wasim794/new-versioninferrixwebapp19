export class MqttConnectionParametersModel {
  brokerUri!: string;
  clientId!: string;
  userName!: string;
  userPassword!: string;
  topicFilters!: string;
  autoReconnect!: boolean;
  cleanSession!: boolean;
  keepAliveInterval!: number;
  connectionTimeout!: number;
  qosType!: string;
  x509CaCrt!: string;
  awsIot!: boolean;
  privateKey!: string;
  x509ClientCrt!: string;

  constructor(model?: Partial<MqttConnectionParametersModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
