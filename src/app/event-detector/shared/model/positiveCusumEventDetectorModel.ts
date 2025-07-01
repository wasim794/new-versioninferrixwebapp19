import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class PositiveCusumEventDetectorModel extends AbstractPointEventDetectorModel {
  limit: any;
  weight: any;
  duration!: TimePeriodModel;
  detectorType!: 'POSITIVE_CUSUM_DETECTOR';
}
