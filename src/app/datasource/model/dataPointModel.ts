import {TimePeriodModel} from '../../core/models/timePeriod';
import {LoggingPropertiesModel} from './loggingPropertiesModel';
import {BasicModel} from '../../common';
import {PointLocatorModel} from './pointLocatorModel';

export class DataPointModel extends BasicModel {
  enabled: any;
  deviceName: any;
  purgePeriod!: TimePeriodModel;
  textRenderer: any;
  loggingPropertiesModel!: LoggingPropertiesModel;
  readPermission!: string;
  setPermission!: string;
  pointLocator!: PointLocatorModel;
  dataSourceId!: number;
  dataSourceXid!: string;
  dataSourceName!: string;
  websocketStatus: any;
  webSocketTime: any;
}
