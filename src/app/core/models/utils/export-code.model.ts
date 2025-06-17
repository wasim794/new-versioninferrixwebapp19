export class ExportCodeModel {
  public code!: string;
  public name!: string;

  constructor(model?: Partial<ExportCodeModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
