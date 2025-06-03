import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class AnalogLowLimitEventDetectorModel extends TimeoutEventDetectorModel<AnalogLowLimitEventDetectorModel> {
  limit: number;
  resetLimit: number;
  useResetLimit: boolean;
  notLower: boolean;
  detectorType = 'ANALOG_LOW_LIMIT_DETECTOR';

  constructor(model?: Partial<AnalogLowLimitEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
