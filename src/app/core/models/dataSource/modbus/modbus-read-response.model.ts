export class ModbusReadResponseModel {
  public data!: number[];

  constructor(model?: Partial<ModbusReadResponseModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
