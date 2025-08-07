export class DailySchedule {
  changes!: [];

  constructor(model ?: Partial<DailySchedule>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
