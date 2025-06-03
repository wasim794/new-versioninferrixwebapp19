import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class AlphanumericStateEventDetectorModel extends TimeoutEventDetectorModel<AlphanumericStateEventDetectorModel> {
  state: string;
  detectorType = 'ALPHANUMERIC_STATE_DETECTOR';

  constructor(model?: Partial<AlphanumericStateEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
