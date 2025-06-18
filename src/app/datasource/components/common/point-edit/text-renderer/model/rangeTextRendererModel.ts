import {BaseTextRendererModel} from './baseTextRendererModel';

export class RangeTextRendererModel extends BaseTextRendererModel {
  format!: string;
  rangeValues: any = [];
}
