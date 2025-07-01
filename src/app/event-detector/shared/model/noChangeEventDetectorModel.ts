import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class NoChangeEventDetectorModel extends AbstractPointEventDetectorModel{
  duration!: TimePeriodModel;
  detectorType!: 'NO_CHANGE_DETECTOR';

}
