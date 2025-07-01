import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class AnalogLowLimitEventDetectorModel extends AbstractPointEventDetectorModel {
  duration!: TimePeriodModel;
  limit!: number;
  resetLimit!: number;
  useResetLimit!: boolean;
  notLower!: boolean;
  detectorType!: 'ANALOG_LOW_LIMIT_DETECTOR';
}
