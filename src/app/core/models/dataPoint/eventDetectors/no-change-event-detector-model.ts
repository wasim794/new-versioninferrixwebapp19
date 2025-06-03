import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class NoChangeEventDetectorModel extends TimeoutEventDetectorModel<NoChangeEventDetectorModel> {
  detectorType = 'NO_CHANGE_DETECTOR';

  constructor(model?: Partial<NoChangeEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
