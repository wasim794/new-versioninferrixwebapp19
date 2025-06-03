import {BasicModel} from '../basic.model';
import {EventTypeAlarmLevelModel} from './event-type-alarm-level.model';
import {TimePeriodModel} from "../timePeriod";

export class AbstractDatasourceModel<T extends AbstractDatasourceModel<T>> extends BasicModel<T> {
  public modelType!: string;
  readonly connectionDescription?: string;
  readonly description?: string;
  public purgeOverride!: boolean;
  public purgePeriod?: TimePeriodModel;
  public editPermission!: string;
  public enabled!: boolean;
  public alarmLevels?: EventTypeAlarmLevelModel[];

  constructor(model?: Partial<T>) {
    super(model);
    if (this.alarmLevels) {
      this.alarmLevels = (model as any).alarmLevels.map((alarmLevel: EventTypeAlarmLevelModel | undefined) => new EventTypeAlarmLevelModel(alarmLevel));
    }
    if (!this.purgePeriod) {
      this.purgePeriod = new TimePeriodModel(model?.purgePeriod || {});
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
