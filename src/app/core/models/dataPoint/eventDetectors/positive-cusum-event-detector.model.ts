import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class PositiveCusumEventDetectorModel extends TimeoutEventDetectorModel<PositiveCusumEventDetectorModel> {
  limit: any;
  weight: any;
  detectorType = 'POSITIVE_CUSUM_DETECTOR';

  constructor(model?: Partial<PositiveCusumEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
