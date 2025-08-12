export class VirtualSwitchControlModel {
  autoMode: boolean;
  dimValue: number;

  public constructor(model?: Partial<VirtualSwitchControlModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
