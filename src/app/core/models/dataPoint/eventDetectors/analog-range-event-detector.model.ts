import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class AnalogRangeEventDetectorModel extends TimeoutEventDetectorModel<AnalogRangeEventDetectorModel> {
  low: number;
  high: number;
  withinRange: boolean;
  detectorType = 'ANALOG_RANGE_DETECTOR';

  constructor(model?: Partial<AnalogRangeEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
