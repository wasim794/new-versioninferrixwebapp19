export class EventTypeAlarmLevelModel {
  public eventType!: string;
  public duplicateHandling!: string;
  public level!: string;
  public description!: string;

  constructor(model?: EventTypeAlarmLevelModel) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
