export class OpcItemModel {
  public tag!: string;
  public dataType!: string;
  public settable!: boolean;
  public validate!: boolean;

  constructor(model?: Partial<OpcItemModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
