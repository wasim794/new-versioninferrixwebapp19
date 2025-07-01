import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class AnalogRangeEventDetectorModel extends AbstractPointEventDetectorModel {
  duration!: TimePeriodModel;
  low!: number;
  high!: number;
  withinRange!: boolean;
  detectorType!: 'ANALOG_RANGE_DETECTOR';
}
