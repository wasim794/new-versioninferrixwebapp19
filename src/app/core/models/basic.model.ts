export abstract class BasicModel<T> {
  public id?: number;
  public xid?: string;
  public name?: string;

  protected constructor(model?: Partial<T>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
