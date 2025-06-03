import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class AlphanumericRegexStateEventDetectorModel extends TimeoutEventDetectorModel<AlphanumericRegexStateEventDetectorModel> {
  state: string;
  detectorType = 'ALPHANUMERIC_REGEX_STATE_DETECTOR';

  constructor(model?: Partial<AlphanumericRegexStateEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
