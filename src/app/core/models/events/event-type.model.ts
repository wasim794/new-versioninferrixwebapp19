import {AbstractEventTypesModel} from './abstract-event-types.model';
import {AuditEventTypeModel} from './audit-event-type.model';
import {DatapointEventTypeModel} from './datapoint-event-type.model';
import {DatasourceEventTypeModel} from './datasource-event-type.model';
import {SystemEventTypeModel} from './system-event-type.model';

export class EventTypeModel<T extends AbstractEventTypesModel<any>> {
  public type?: AbstractEventTypesModel<any>;
  public description!: string;
  public alarmLevel!: string;
  public supportsSubtype!: boolean;
  public supportsReferenceId1!: boolean;
  public supportsReferenceId2!: boolean;

  constructor(model?: Partial<EventTypeModel<T>>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model && model.type) {
      if (model?.type.eventType === 'AUDIT') {
        this.type = new AuditEventTypeModel(model.type);
      } else if (model?.type.eventType === 'DATA_POINT') {
        this.type = new DatapointEventTypeModel(model.type);
      } else if (model?.type.eventType === 'DATA_SOURCE') {
        this.type = new DatasourceEventTypeModel(model.type);
      } else if (model?.type.eventType === 'SYSTEM') {
        this.type = new SystemEventTypeModel(model.type);
      }
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
