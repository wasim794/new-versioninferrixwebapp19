import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class NegativeCusumEventDetectorModel extends TimeoutEventDetectorModel<NegativeCusumEventDetectorModel> {
  limit: number;
  weight: number;
  detectorType = 'NEGATIVE_CUSUM_DETECTOR';

  constructor(model?: Partial<NegativeCusumEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
