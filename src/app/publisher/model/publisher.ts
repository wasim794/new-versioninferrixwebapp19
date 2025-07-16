// @ts-ignore
import {EventAlarmLevels} from '../../common/model/eventAlarmLevels';
import {TimePeriodModel} from '../../core/models/timePeriod';
import {BasicModel} from '../../common/model/basicModel';

export class Publisher extends BasicModel {
  modelType!: string;
  description: any;
  connectionDescription: any;
  enabled!: boolean;
  points = [];
  eventAlarmLevels!: EventAlarmLevels[];
  publishType!: string;
  cacheWarningSize!: number;
  cacheDiscardSize!: number;
  snapshotSendPeriod = new TimePeriodModel();
  sendSnapshot!: boolean;
}
