import {DailySchedule} from './daily-schedule';
import {CalendarRuleSetModel} from './calendar-rule-set.model';

export class ExceptionModel {
  schedule!: DailySchedule;
  ruleSet!: CalendarRuleSetModel;

  constructor(model ?: Partial<CalendarRuleSetModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
