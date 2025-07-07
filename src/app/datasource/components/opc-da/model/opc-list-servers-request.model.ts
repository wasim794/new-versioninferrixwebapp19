export class OpcListServersRequestModel {
  public host!: string;
  public domain!: string;
  public user!: string;
  public password!: string;      

  constructor(model?: Partial<OpcListServersRequestModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
