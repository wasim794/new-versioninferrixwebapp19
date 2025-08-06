import {DailySchedule} from './daily-schedule';

export class WeeklySchedule {
  dailySchedules!: DailySchedule[];

  constructor(model ?: Partial<WeeklySchedule>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
