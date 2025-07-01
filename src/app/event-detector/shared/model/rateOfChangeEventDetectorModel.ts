import {TimePeriodType} from '../../../common/model/timePeriodType';
import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

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
export class RateOfChangeEventDetectorModel extends AbstractPointEventDetectorModel {
  detectorType!: 'RATE_OF_CHANGE_DETECTOR';
  rateOfChangeThreshold!: number;
  rateOfChangeThresholdPeriodType!: TimePeriodType;
  rateOfChangePeriod!: TimePeriodModel;
  duration!: TimePeriodModel;
  comparisonMode!: ComparisonMode;
  calculationMode!: CalculationMode;
  resetThreshold!: number;
  useResetThreshold!: boolean;
  useAbsoluteValue!: boolean;
}
