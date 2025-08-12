import {BasicModel} from '../../../../core/models';

export class VirtualSwitchModel extends BasicModel<VirtualSwitchModel> {
  uid: string;
  gradeType: string;
  grade: number;

  public constructor(model?: Partial<VirtualSwitchModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
