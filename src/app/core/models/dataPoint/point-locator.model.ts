export abstract class PointLocatorModel<T> {
  public dataType!: string;
  public settable!: boolean;
  public relinquishable!: boolean;
  public configurationDescription!: string;
  public phaseId!: string;
  public ctId!: string;
  public controlCommand!: number;

  constructor(model?: Partial<T>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
