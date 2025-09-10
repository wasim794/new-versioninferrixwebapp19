export class MqttIntegrationModel {
  provisionDeviceKey!: string;
  provisionDeviceSecret!: string;
  username!: string;
  password!: string;
  publishTopicFilter!: string;
  subscriptionTopicFilter!: string;
  qosType!: string;

  constructor(model?: Partial<MqttIntegrationModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
