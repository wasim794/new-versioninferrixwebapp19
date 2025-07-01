import {TimePeriodModel} from '../../../core/models/timePeriod/time-period.model';
import {AbstractPointEventDetectorModel} from './abstractPointEventDetectorModel';

export class BinaryStateEventDetectorModel extends AbstractPointEventDetectorModel {
  declare action: any;
  state!: boolean;
  detectorType!: 'BINARY_STATE_DETECTOR';
  duration!: TimePeriodModel;
}
