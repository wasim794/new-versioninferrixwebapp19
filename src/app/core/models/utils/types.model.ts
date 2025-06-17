export class TypesModel {
  type!: string;
  name!: string;

  constructor(model?: Partial<TypesModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
