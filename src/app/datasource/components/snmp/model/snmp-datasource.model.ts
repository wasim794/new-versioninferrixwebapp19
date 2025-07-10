import {AbstractPollingDatasourceModel} from '../../../../core/models/dataSource/abstract-polling-datasource.model';

export class SnmpDatasourceModel extends AbstractPollingDatasourceModel<SnmpDatasourceModel> {
  public override modelType = 'SNMP.DS';
  public host!: string;
  public port = 161;
  public snmpVersion!: string;
  public readCommunity!: string;
  public writeCommunity!: string;
  public engineId!: string;
  public contextEngineId!: string;
  public contextName!: string;
  public securityName!: string;
  public authProtocol = 'NONE';
  public authPassphrase!: string;
  public privProtocol = 'NONE';
  public privPassphrase!: string;
  public retries = 2;
  public timeout = 1000;
  public trapPort = 162;
  public maxRequestVars: any;
  public localAddress: any;

  constructor(model?: Partial<SnmpDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
