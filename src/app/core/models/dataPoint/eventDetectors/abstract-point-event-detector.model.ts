import {AbstractEventDetectorModel} from "./abstract-event-detector.model";

export abstract class AbstractPointEventDetectorModel<T extends AbstractPointEventDetectorModel<T>> extends AbstractEventDetectorModel<T> {
  dataPointXid: string

  constructor(model?: Partial<T>) {
    super(model);
  }

  toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
