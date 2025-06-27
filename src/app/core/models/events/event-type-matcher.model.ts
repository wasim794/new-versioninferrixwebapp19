export class EventTypeMatcherModel {
  public eventType!: string;
  public subType!: string;
  public referenceId1!: number;
  public referenceId2!: number;

  constructor(model?: Partial<EventTypeMatcherModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
