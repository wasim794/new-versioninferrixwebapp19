import {PointLocatorModel} from '../../../model/pointLocatorModel';

export class VirtualPointLocatorModel extends PointLocatorModel {
  override modelType = 'VIRTUAL.PL';
  changeType!: string;
  startValue!: string;
  values: any = [];
  min!: number;
  max!: number;
  roll!: boolean;
  change!: number;
  maxChange!: number;
  volatility!: number;
  attractionPointXid!: string;
}

