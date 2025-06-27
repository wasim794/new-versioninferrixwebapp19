import {AbstractEventTypesModel} from './abstract-event-types.model';

export class PublisherEventTypeModel extends AbstractEventTypesModel<PublisherEventTypeModel> {
  constructor(model?: Partial<PublisherEventTypeModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
