import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class AnalogHighLimitEventDetectorModel extends AbstractPointEventDetectorModel{
  limit!: number;
  resetLimit!: number;
  useResetLimit!: boolean;
  notHigher!: boolean;
  duration!: TimePeriodModel;
  detectorType!: 'ANALOG_HIGH_LIMIT_DETECTOR';
}
