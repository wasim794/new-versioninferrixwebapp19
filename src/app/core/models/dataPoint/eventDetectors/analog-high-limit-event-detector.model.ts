import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";

export class AnalogHighLimitEventDetectorModel extends TimeoutEventDetectorModel<AnalogHighLimitEventDetectorModel> {
  limit: number;
  resetLimit: number;
  useResetLimit: boolean;
  notHigher: boolean;
  detectorType = 'ANALOG_HIGH_LIMIT_DETECTOR';

  constructor(model?: Partial<AnalogHighLimitEventDetectorModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
