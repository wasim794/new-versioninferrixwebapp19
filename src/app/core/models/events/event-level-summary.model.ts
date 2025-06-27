import {EventInstanceModel} from './event-instance.model';

export class EventLevelSummaryModel {
  public alarmLevel!: string;
  public count!: number;
  public event!: EventInstanceModel;

  constructor(model?: Partial<EventLevelSummaryModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
