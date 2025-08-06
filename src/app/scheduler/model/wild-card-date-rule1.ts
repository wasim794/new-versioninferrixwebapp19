import {CalendarRule} from './calendar-rule';

export class WildCardDateRule1 implements CalendarRule {
  type = 'WildcardDateRule1';
  year!: number;
  month!: number;
  day!: number;
  dayOfWeek!: number;

  constructor(model ?: Partial<WildCardDateRule1>) {
    if (model) {
      Object.assign(this, model);
    }
  }
  endDate: any;

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }

  startDate: any;
}
