import {BasicModel} from '../../index';
import {EventTypeMatcherModel} from '../index';

export class AbstractEventHandlerModel<T extends AbstractEventHandlerModel<T>> extends BasicModel<T> {
  public disabled!: boolean;
  public eventTypes?: EventTypeMatcherModel[];
  public handlerType!: string;

  constructor(model?: Partial<T>) {
    super(model);
    if (model && model.eventTypes) {
      this.eventTypes = model.eventTypes.map((eventType) => new EventTypeMatcherModel(eventType));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
