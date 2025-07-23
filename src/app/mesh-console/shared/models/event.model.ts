export class EventModel {
  eventType: string;
  eventMessage: string;

  constructor(model?: Partial<EventModel>) {
    if(model) {
      Object.assign(this, model);
    }
  }
}
