import {AbstractEventTypesModel} from './abstract-event-types.model';

export class DatasourceEventTypeModel extends AbstractEventTypesModel<DatasourceEventTypeModel> {
  public alarmLevel!: number;

  constructor(model?: Partial<DatasourceEventTypeModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
