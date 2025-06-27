import {AbstractEventTypesModel} from './abstract-event-types.model';

export class DatapointEventTypeModel extends AbstractEventTypesModel<DatapointEventTypeModel> {
  public dataSourceId!: number;

  constructor(model?: Partial<DatapointEventTypeModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
