import {TimeoutEventDetectorModel} from "./timeout-event-detector.model";
import {TimePeriodModel} from "../../timePeriod";

enum ComparisonMode {
  GREATER_THAN,
  GREATER_THAN_OR_EQUALS,
  LESS_THAN,
  LESS_THAN_OR_EQUALS
}

enum CalculationMode {
  INSTANTANEOUS,
  AVERAGE
}

export enum TimePeriodType {
  MILLISECONDS,
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}

export class RateOfChangeEventDetectorModel extends TimeoutEventDetectorModel<RateOfChangeEventDetectorModel> {
  detectorType = 'RATE_OF_CHANGE_DETECTOR';
  rateOfChangeThreshold: number;
  rateOfChangeThresholdPeriodType: TimePeriodType;
  rateOfChangePeriod: TimePeriodModel;
  comparisonMode: ComparisonMode;
  calculationMode: CalculationMode;
  resetThreshold: number;
  useResetThreshold: boolean;
  useAbsoluteValue: boolean;

  constructor(model?: Partial<RateOfChangeEventDetectorModel>) {
    super(model);
  }


  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
