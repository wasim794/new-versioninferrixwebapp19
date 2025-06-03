import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";
import {BinaryStateEventDetectorModel} from "./binary-state-event-detector.model";

export class MultistateStateEventDetectorModel extends TimeoutEventDetectorModel<MultistateStateEventDetectorModel> {
  state: number;
  detectorType = 'MULTISTATE_STATE_DETECTOR';

  constructor(model?: Partial<MultistateStateEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
