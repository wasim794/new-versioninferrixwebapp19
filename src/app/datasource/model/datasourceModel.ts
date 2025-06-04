import {BasicModel} from '../../common';
import {EventTypeAlarmLevelModel} from '../../core/models/dataSource';
import {TimePeriodModel} from '../../core/models/timePeriod';

export class DatasourceModel extends BasicModel {
  modelType!: string;
  connectionDescription: any;
  description: any;
  editPermission!: string;
  enabled!: boolean;
  timePeriod: TimePeriodModel = new TimePeriodModel;
  alarmLevels!: EventTypeAlarmLevelModel;
  quantize!: boolean;
}

