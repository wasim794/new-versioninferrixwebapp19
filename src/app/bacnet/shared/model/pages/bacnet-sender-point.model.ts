import { AbstractPublisherPointModel } from '../../../../core/models/publisher';
import { IntrinsicAlarmModel } from "./intrinsic-alarm.model";
import { AnalogIntrinsicAlarmModel } from "./analog-intrinsic-alarm.model";
import { BinaryIntrinsicAlarmModel } from "./binary-intrinsic-alarm.model";
import { MultistateIntrinsicAlarmModel } from "./multistate-intrinsic-alarm.model";

export class BacnetSenderPointModel extends AbstractPublisherPointModel<BacnetSenderPointModel> {
  public modelType = 'BACNET_PUBLISHER.POINT';
  public dataPointName!: string;
  public instanceNumber!: number;
  public objectName!: string;
  public objectType!: string;
  public useIntrinsicAlarms!: boolean;
  public intrinsicAlarmConfig: IntrinsicAlarmModel | AnalogIntrinsicAlarmModel | BinaryIntrinsicAlarmModel | MultistateIntrinsicAlarmModel = new IntrinsicAlarmModel();

  constructor(model?: Partial<BacnetSenderPointModel>) {
    super(model);

    if (model?.intrinsicAlarmConfig) {
      const config = model.intrinsicAlarmConfig;
      if (config instanceof AnalogIntrinsicAlarmModel && config.limitEnable) {
        this.intrinsicAlarmConfig = new AnalogIntrinsicAlarmModel(config);
      } else if (config instanceof BinaryIntrinsicAlarmModel) {
        this.intrinsicAlarmConfig = new BinaryIntrinsicAlarmModel(config);
      } else if (config instanceof MultistateIntrinsicAlarmModel) {
        this.intrinsicAlarmConfig = new MultistateIntrinsicAlarmModel(config);
      } else {
        this.intrinsicAlarmConfig = new IntrinsicAlarmModel(config);
      }
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
