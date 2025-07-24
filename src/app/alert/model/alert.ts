import {BasicModel} from '../../common/model/basicModel';
import {WeeklySchedule} from './weeklySchedule';

export class Alert extends BasicModel {

  receiveAlarmAlerts!: string;
  readPermissions!: string;
  declare editPermissions: string;
  inactiveSchedule= new WeeklySchedule();
  recipients= [];
}
