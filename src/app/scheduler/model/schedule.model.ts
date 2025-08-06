import {WeeklySchedule} from './weekly-schedule';
import {ExceptionModel} from './exception.model';
import {BasicModel} from '../../core/models';

export class ScheduleModel extends BasicModel<ScheduleModel> {
  readPermission!: string;
  editPermission!: string;
  alarmLevel!: string;
  errorAlarmLevel!: string;
  defaultSchedule!: WeeklySchedule;
  exceptions!: ExceptionModel[];
  enabled!: boolean;

  constructor(model ?: Partial<ScheduleModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
