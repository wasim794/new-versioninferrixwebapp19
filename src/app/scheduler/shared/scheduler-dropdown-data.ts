import {Alarm_level, StaticData} from '../../common/static-data/static-data';

export class AlarmLevelDropdownData {
  private _alarmLevel = Alarm_level;
  get alarmLevel(): StaticData[] {
    return this._alarmLevel;
  }


}
