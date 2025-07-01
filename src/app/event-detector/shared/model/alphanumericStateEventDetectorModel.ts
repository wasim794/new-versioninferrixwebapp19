import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class AlphanumericStateEventDetectorModel extends AbstractPointEventDetectorModel{
  state!: string;
  duration!: TimePeriodModel;
  detectorType!: 'ALPHANUMERIC_STATE_DETECTOR';
}
