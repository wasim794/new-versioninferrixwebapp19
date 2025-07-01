import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class NegativeCusumEventDetectorModel extends AbstractPointEventDetectorModel {
  limit!: number;
  weight!: number;
  duration!: TimePeriodModel;
  detectorType!: 'NEGATIVE_CUSUM_DETECTOR';
}
