import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class MultistateStateEventDetectorModel extends AbstractPointEventDetectorModel{
  duration!: TimePeriodModel;
  state!: number;
  detectorType!: 'MULTISTATE_STATE_DETECTOR';
}
