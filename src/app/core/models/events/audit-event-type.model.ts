import {AbstractEventTypesModel} from './abstract-event-types.model';

export class AuditEventTypeModel extends AbstractEventTypesModel<AuditEventTypeModel> {
  public changeType!: string;

  constructor(model?: Partial<AuditEventTypeModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
