import {TimePeriodModel} from '../timePeriod';

export class LoggingPropertiesModel {
  public loggingType!: string;
  public intervalLoggingType?: string;
  public intervalLoggingPeriod?: TimePeriodModel;
  public tolerance!: number;
  public discardExtremeValues!: boolean;
  public discardLowLimit?: number;
  public discardHighLimit?: number;
  public cacheSize!: number;

  constructor(model?: LoggingPropertiesModel) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
