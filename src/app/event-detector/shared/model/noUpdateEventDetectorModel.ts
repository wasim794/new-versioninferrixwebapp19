import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class NoUpdateEventDetectorModel extends AbstractPointEventDetectorModel {
  duration!: TimePeriodModel;
  detectorType!: 'NO_UPDATE_DETECTOR';
}
