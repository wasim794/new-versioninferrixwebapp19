import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';
import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';

export class TimeoutEventDetectorModel extends AbstractPointEventDetectorModel {
  duration!: TimePeriodModel;
}
