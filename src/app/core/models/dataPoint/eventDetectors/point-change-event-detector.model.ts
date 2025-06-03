import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class PointChangeEventDetectorModel extends TimeoutEventDetectorModel<PointChangeEventDetectorModel> {
  detectorType = 'POINT_CHANGE_DETECTOR';

  constructor(model?: Partial<PointChangeEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
