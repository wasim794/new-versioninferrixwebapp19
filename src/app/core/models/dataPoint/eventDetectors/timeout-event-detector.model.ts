import {AbstractPointEventDetectorModel} from "./abstract-point-event-detector.model";
import {TimePeriodModel} from "../../timePeriod";

export abstract class TimeoutEventDetectorModel<T extends TimeoutEventDetectorModel<T>> extends AbstractPointEventDetectorModel<T> {
  duration: TimePeriodModel

  constructor(model?: Partial<T>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
