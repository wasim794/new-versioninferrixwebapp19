import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class BinaryStateEventDetectorModel extends TimeoutEventDetectorModel<BinaryStateEventDetectorModel> {
  action: string;
  state: boolean;
  detectorType = 'BINARY_STATE_DETECTOR';

  constructor(model?: Partial<BinaryStateEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
