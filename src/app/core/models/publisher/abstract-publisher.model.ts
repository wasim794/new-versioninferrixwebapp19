import {BasicModel} from '../basic.model';
import {EventTypeAlarmLevelModel} from '../dataSource';
import {AbstractPublisherPointModel} from './abstract-publisher-point.model';
import {TimePeriodModel} from '../timePeriod';

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
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
