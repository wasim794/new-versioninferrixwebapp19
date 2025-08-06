import {CalendarRule} from './calendar-rule';
import {BasicModel} from '../../core/models';

export class CalendarRuleSetModel extends BasicModel<CalendarRuleSetModel> {
  rules!: CalendarRule[];
  editPermission!: string;

  constructor(model ?: Partial<CalendarRuleSetModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
