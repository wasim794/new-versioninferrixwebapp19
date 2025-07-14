import {EventTypeModel} from '../../../core/models/events/event-type.model';

export class DynamicFlatNode {
  constructor(
    public item: EventTypeModel<any>,
    public level = 1,
    public expandable = false,
    public isClickable = false,
    public isChecked = false
  ) {}
}
