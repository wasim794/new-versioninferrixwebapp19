import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class StateChangeCountEventDetectorModel extends TimeoutEventDetectorModel<StateChangeCountEventDetectorModel> {
  changeCount: number;
  detectorType = 'STATE_CHANGE_COUNT_DETECTOR';

  constructor(model?: Partial<StateChangeCountEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
