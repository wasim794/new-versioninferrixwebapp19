export class RenderedPointValueModel {
  value!: string;
  color!: string;

  constructor(model?: Partial<RenderedPointValueModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
