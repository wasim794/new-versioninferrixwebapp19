import {TimePeriodModel} from '../../core/models/timePeriod';

export class LoggingPropertiesModel {
  loggingType!: string;
  intervalLoggingType!: string;
  intervalLoggingPeriod!: TimePeriodModel;
  tolerance: any;
  discardExtremeValues!: boolean;
  discardLowLimit: any;
  discardHighLimit: any;
  cacheSize: any;
}
