import { BasicModel } from '../basic.model';
import { EventTypeAlarmLevelModel } from '../dataSource';
import { AbstractPublisherPointModel } from './abstract-publisher-point.model';
import { TimePeriodModel } from '../timePeriod';

export class AbstractPublisherModel<T extends AbstractPublisherModel<T>> extends BasicModel<T> {
  public modelType!: string;
  public enabled!: boolean;
  public eventAlarmLevels?: EventTypeAlarmLevelModel[];
  public points!: AbstractPublisherPointModel<any>[];
  public publishType!: string;
  public cacheWarningSize!: number;
  public cacheDiscardSize!: number;
  public sendSnapshot!: boolean;
  public snapshotSendPeriod!: TimePeriodModel;

  constructor(model?: Partial<T>) {
    super(model);
    if (model?.eventAlarmLevels) {
      this.eventAlarmLevels = model.eventAlarmLevels.map((alarmLevel) => new EventTypeAlarmLevelModel(alarmLevel));
    }

    if (model?.snapshotSendPeriod) {
      this.snapshotSendPeriod = new TimePeriodModel(model.snapshotSendPeriod);
    }
  }

  public override toJson(): any {
    const json: any = super.toJson(); // Get the JSON representation from the base class

    // Manually add or override properties specific to AbstractPublisherModel
    // This ensures that all properties are correctly serialized,
    // and you have control over how nested objects are handled.
    json.modelType = this.modelType;
    json.enabled = this.enabled;
    json.eventAlarmLevels = this.eventAlarmLevels?.map(alarmLevel => alarmLevel.toJson()); // Assuming EventTypeAlarmLevelModel also has a toJson()
    json.points = this.points.map(point => point.toJson()); // Assuming AbstractPublisherPointModel also has a toJson()
    json.publishType = this.publishType;
    json.cacheWarningSize = this.cacheWarningSize;
    json.cacheDiscardSize = this.cacheDiscardSize;
    json.sendSnapshot = this.sendSnapshot;
    json.snapshotSendPeriod = this.snapshotSendPeriod.toJson(); // Assuming TimePeriodModel also has a toJson()

    return json;
  }
}