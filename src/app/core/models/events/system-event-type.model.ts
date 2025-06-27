import {AbstractEventTypesModel} from './abstract-event-types.model';

export class SystemEventTypeModel extends AbstractEventTypesModel<SystemEventTypeModel> {
  constructor(model?: Partial<SystemEventTypeModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
