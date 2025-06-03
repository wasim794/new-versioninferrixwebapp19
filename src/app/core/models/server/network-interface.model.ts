export class NetworkInterfaceModel {
  public interfaceName!: string;
  public hostAddress!: string;
  private _name!: string;

  constructor(model?: Partial<NetworkInterfaceModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  get name(): string {
    if (this.interfaceName === '') {
      return this._name = this.hostAddress;
    } else {
      return this._name = this.interfaceName + ' ' + this.hostAddress;
    }
  }
}
