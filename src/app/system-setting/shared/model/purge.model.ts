import {SystemSettingModel} from "../../../core/models";

export class PurgeModel {
  enablePurgePointValues!: boolean;
  enablePurgePointValuesPerPoint!: boolean;
  pointDataPurgePeriodType!: number;
  pointDataPurgePeriods!: number;
  dataPointEventPurgePeriodType!: number;
  dataPointEventPurgePeriods!: number;
  dataSourceEventPurgePeriodType!: number;
  dataSourceEventPurgePeriods!: number;
  systemEventPurgePeriodType!: number;
  systemEventPurgePeriods!: number;
  publisherEventPurgePeriodType!: number;
  publisherEventPurgePeriods!: number;
  auditEventPurgePeriodType!: number;
  auditEventPurgePeriods!: number;
  noneAlarmPurgePeriodType!: number;
  noneAlarmPurgePeriods!: number;
  informationAlarmPurgePeriodType!: number;
  informationAlarmPurgePeriods!: number;
  warningAlarmPurgePeriodType!: number;
  warningAlarmPurgePeriods!: number;
  urgentAlarmPurgePeriodType!: number;
  urgentAlarmPurgePeriods!: number;
  criticalAlarmPurgePeriodType!: number;
  criticalAlarmPurgePeriods!: number;
  emergencyAlarmPurgePeriodType!: number;
  emergencyAlarmPurgePeriods!: number;
  eventPurgePeriodType!: number;
  eventPurgePeriods!: number;

  constructor(model?: Partial<PurgeModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }

  public static convert(model: SystemSettingModel): PurgeModel {
    const purgeModel = new PurgeModel();
    purgeModel.eventPurgePeriods = model.eventPurgePeriods;
    purgeModel.eventPurgePeriodType = model.auditEventPurgePeriodType;
    purgeModel.enablePurgePointValues = model.enablePurgePointValues;
    purgeModel.enablePurgePointValuesPerPoint = model.enablePurgePointValuesPerPoint;
    purgeModel.pointDataPurgePeriods = model.pointDataPurgePeriods;
    purgeModel.pointDataPurgePeriodType = model.pointDataPurgePeriodType;
    purgeModel.dataPointEventPurgePeriods = model.dataPointEventPurgePeriods;
    purgeModel.dataPointEventPurgePeriodType = model.dataSourceEventPurgePeriodType;
    purgeModel.dataSourceEventPurgePeriods = model.dataSourceEventPurgePeriods;
    purgeModel.dataSourceEventPurgePeriodType = model.dataSourceEventPurgePeriodType;
    purgeModel.systemEventPurgePeriods = model.systemEventPurgePeriods;
    purgeModel.systemEventPurgePeriodType = model.systemEventPurgePeriodType;
    purgeModel.publisherEventPurgePeriods = model.publisherEventPurgePeriods;
    purgeModel.publisherEventPurgePeriodType = model.publisherEventPurgePeriodType;
    purgeModel.auditEventPurgePeriods = model.auditEventPurgePeriods;
    purgeModel.auditEventPurgePeriodType = model.auditEventPurgePeriodType;
    purgeModel.noneAlarmPurgePeriods = model.noneAlarmPurgePeriods;
    purgeModel.noneAlarmPurgePeriodType = model.noneAlarmPurgePeriodType;
    purgeModel.informationAlarmPurgePeriods = model.informationAlarmPurgePeriods;
    purgeModel.informationAlarmPurgePeriodType = model.informationAlarmPurgePeriodType;
    purgeModel.warningAlarmPurgePeriods = model.warningAlarmPurgePeriods;
    purgeModel.warningAlarmPurgePeriodType = model.warningAlarmPurgePeriodType;
    purgeModel.urgentAlarmPurgePeriods = model.urgentAlarmPurgePeriods;
    purgeModel.urgentAlarmPurgePeriodType = model.urgentAlarmPurgePeriodType;
    purgeModel.criticalAlarmPurgePeriods = model.criticalAlarmPurgePeriods;
    purgeModel.criticalAlarmPurgePeriodType = model.criticalAlarmPurgePeriodType;
    purgeModel.emergencyAlarmPurgePeriods = model.emergencyAlarmPurgePeriods;
    purgeModel.emergencyAlarmPurgePeriodType = model.emergencyAlarmPurgePeriodType;
    return purgeModel;
  }
}
