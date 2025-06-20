import { BasicModel } from '../basic.model';
import { EventTypeAlarmLevelModel } from './event-type-alarm-level.model';
import { TimePeriodModel } from "../timePeriod";

export class AbstractDatasourceModel<T extends AbstractDatasourceModel<T>> extends BasicModel<T> {
  modelType?: string;
  connectionDescription = '';
  description = '';
  purgeOverride = false;
  purgePeriod?: TimePeriodModel;
  editPermission = '';
  enabled = false;
  alarmLevels?: EventTypeAlarmLevelModel[];

  constructor(model: Partial<T> = {}) {
    super(model);
    Object.assign(this, model);
    this.alarmLevels = model.alarmLevels?.map(al => new EventTypeAlarmLevelModel(al));
    this.purgePeriod = model.purgePeriod && new TimePeriodModel(model.purgePeriod);
  }

  override toJson() {
    return {
      ...super.toJson(),
      modelType: this.modelType,
      connectionDescription: this.connectionDescription,
      description: this.description,
      purgeOverride: this.purgeOverride,
      purgePeriod: this.purgePeriod?.toJson(),
      editPermission: this.editPermission,
      enabled: this.enabled,
      alarmLevels: this.alarmLevels?.map(al => al.toJson())
    };
  }
}
