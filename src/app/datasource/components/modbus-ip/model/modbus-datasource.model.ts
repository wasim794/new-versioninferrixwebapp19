import {AbstractPollingDatasourceModel} from '../../../../core/models/dataSource/abstract-polling-datasource.model';

export abstract class ModbusDatasourceModel<T extends ModbusDatasourceModel<T>> extends AbstractPollingDatasourceModel<T> {
  public timeout: number = 0; // Initialized
  public retries: number = 0; // Initialized
  public multipleWritesOnly: boolean = false; // Initialized
  public contiguousBatches: boolean = false; // Initialized
  public createSlaveMonitorPoints: boolean = false; // Initialized
  public maxReadBitCount: number = 0; // Initialized
  public maxReadRegisterCount: number = 0; // Initialized
  public maxWriteRegisterCount: number = 0; // Initialized
  public discardDataDelay: number = 0; // Initialized
  public logIO: boolean = false; // Initialized
  public ioLogFileSizeMBytes: number = 0; // Initialized
  public maxHistoricalIOLogs: number = 0; // Initialized


  constructor(model?: Partial<T>) {
    super(model);
    // If you intend to populate these properties from the 'model' object,
    // you should add logic here, for example:
    if (model) {
      Object.assign(this, model);
    }
  }

  public override toJson(): any {
    // super.toJson() is called but its return value is not used.
    // If AbstractPollingDatasourceModel's toJson() returns a specific object,
    // you might want to merge it or use it.
    // For now, keeping the original logic which effectively deep clones 'this'.
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
