export class PlatformDetailsModel {
  url!: string;
  username!: string;
  password!: string;

  constructor(model?: Partial<PlatformDetailsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
