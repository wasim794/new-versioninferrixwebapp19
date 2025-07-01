import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class StateChangeCountEventDetectorModel extends AbstractPointEventDetectorModel {
  changeCount!: number;
  duration!: TimePeriodModel;
  detectorType!: 'STATE_CHANGE_COUNT_DETECTOR';
}
