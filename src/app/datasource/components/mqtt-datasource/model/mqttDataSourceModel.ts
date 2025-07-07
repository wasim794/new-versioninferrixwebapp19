import {AbstractDatasourceModel} from '../../../../core/models/dataSource';
export class MqttDataSourceModel extends AbstractDatasourceModel<MqttDataSourceModel> {
  override modelType = 'MQTT.DS';
  brokerUri!: string;
  x509CaCrt!: string;
  x509ClientCrt!: string;
  privateKey!: string;
  useCertificate!: boolean;
  clientId!: string;
  userName!: string;
  userPassword!: string;
  topicFilters!: string;
  autoReconnect!: boolean;
  cleanSession!: boolean;
  keepAliveInterval!: number;
  connectionTimeout!: number;
  qosType!: string;

  constructor(model?: Partial<MqttDataSourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }

}

