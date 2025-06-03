export class TimePeriodModel {
  timePeriod!: number;
  timePeriodType!: string;

  constructor(model?: Partial<TimePeriodModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
