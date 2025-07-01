import {DataPointModel} from '../../../datasource/model/dataPointModel';
import {AbstractEventDetectorModel} from './abstractEventDetectorModel';

export class AbstractPointEventDetectorModel extends AbstractEventDetectorModel {
  dataPoint!: DataPointModel;
}
