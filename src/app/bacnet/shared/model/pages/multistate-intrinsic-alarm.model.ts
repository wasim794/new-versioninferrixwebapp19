import {IntrinsicAlarmModel} from "./intrinsic-alarm.model";

export class MultistateIntrinsicAlarmModel extends IntrinsicAlarmModel {
  public modelType: string = "MULTISTATE_INTRINSIC.ALARM";
  public alarmValues!: number[];
  public faultValues!: number[];

  constructor(model?: Partial<MultistateIntrinsicAlarmModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
