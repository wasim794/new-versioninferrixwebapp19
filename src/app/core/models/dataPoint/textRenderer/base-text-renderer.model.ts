export abstract class BaseTextRendererModel<T> {
  type!: string;

  constructor(model?: Partial<T>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
