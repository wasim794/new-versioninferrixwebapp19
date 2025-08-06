import {WildCardDateRule1} from './wild-card-date-rule1';
import {CalendarRule} from './calendar-rule';

export class WildCardDateRangeRule1 implements CalendarRule {
  type = 'WildcardDateRangeRule1';
  startDate!: WildCardDateRule1;
  endDate!: WildCardDateRule1;

  constructor(model ?: Partial<WildCardDateRangeRule1>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
