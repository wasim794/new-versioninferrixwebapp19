import {AbstractPollingDatasourceModel} from '../../../../core/models/dataSource/abstract-polling-datasource.model';

export abstract class ModbusDatasourceModel<T extends ModbusDatasourceModel<T>> extends AbstractPollingDatasourceModel<T> {
  public timeout!: number;
  public retries!: number;
  public multipleWritesOnly!: boolean;
  public contiguousBatches!: boolean;
  public createSlaveMonitorPoints!: boolean;
  public maxReadBitCount!: number;
  public maxReadRegisterCount!: number;
  public maxWriteRegisterCount!: number;
  public discardDataDelay!: number;
  public logIO!: boolean;
  public ioLogFileSizeMBytes!: number;
  public maxHistoricalIOLogs!: number;

  constructor(model?: Partial<T>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
