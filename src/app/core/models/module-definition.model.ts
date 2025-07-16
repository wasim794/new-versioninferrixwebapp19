export class ModuleDefinitionModel {
  public type!: string;
  public name!: string;


  constructor(model?: Partial<ModuleDefinitionModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
