import {EventTransitionBitsModel, IntrinsicAlarmModel} from "./intrinsic-alarm.model";


export class LimitEnableModel {
  public lowLimitEnable: boolean = false;
  public highLimitEnable: boolean = false;

  constructor(model?: Partial<LimitEnableModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

export class AnalogIntrinsicAlarmModel extends IntrinsicAlarmModel {
  public modelType: string = "ANALOG_INTRINSIC.ALARM";
  public highLimit!: number;
  public lowLimit!: number;
  public deadband!: number;
  public faultHighLimit!: number;
  public faultLowLimit!: number;
  public limitEnable: LimitEnableModel = new LimitEnableModel();

  constructor(model?: Partial<AnalogIntrinsicAlarmModel>) {
    super(model);
    if (model) {
      Object.assign(this, model)
    }
    if (model?.limitEnable) {
      this.limitEnable = new LimitEnableModel(model?.limitEnable);
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}





