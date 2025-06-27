import {BasicModel} from '../basic.model';

export class UserCommentsModel extends BasicModel<UserCommentsModel> {
  public userId: any;
  public username!: string;
  public comment!: string;
  public timestamp: any;
  public commentType!: string;
  public referenceId: any;

  constructor(model?: Partial<UserCommentsModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
