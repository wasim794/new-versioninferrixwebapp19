import {IntrinsicAlarmModel} from "./intrinsic-alarm.model";

export class BinaryIntrinsicAlarmModel extends IntrinsicAlarmModel {
  public modelType: string = "BINARY_INTRINSIC.ALARM";
  public alarmValue!: number;

  constructor(model?: Partial<BinaryIntrinsicAlarmModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
