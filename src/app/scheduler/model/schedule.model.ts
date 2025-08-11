import { WeeklySchedule } from './weekly-schedule';
import { ExceptionModel } from './exception.model';
import { BasicModel } from '../../core/models';

export class ScheduleModel extends BasicModel<ScheduleModel> {
  readPermission?: string;
  editPermission?: string;
  alarmLevel?: string;
  errorAlarmLevel?: string;
  defaultSchedule?: WeeklySchedule;
  exceptions?: ExceptionModel[];
  enabled?: boolean;

  constructor(model?: Partial<ScheduleModel>) {
    super(model);
    // Optionally, assign properties manually if BasicModel doesn't do this:
    Object.assign(this, model);
  }

  public override toJson(): any {
    // Optionally get base class JSON if super.toJson() does something more
    // Otherwise, just return a plain object
    return { ...this };
  }
}
