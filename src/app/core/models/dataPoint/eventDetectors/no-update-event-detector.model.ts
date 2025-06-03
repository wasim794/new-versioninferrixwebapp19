import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class NoUpdateEventDetectorModel extends TimeoutEventDetectorModel<NoUpdateEventDetectorModel> {
  detectorType = 'NO_UPDATE_DETECTOR';

  constructor(model?: Partial<NoUpdateEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
