import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class AlphanumericRegexStateEventDetectorModel extends AbstractPointEventDetectorModel {
  state!: string;
  duration!: TimePeriodModel;
  detectorType!: 'ALPHANUMERIC_REGEX_STATE_DETECTOR';
}
