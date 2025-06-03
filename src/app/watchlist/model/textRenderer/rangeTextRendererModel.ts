import {BaseTextRendererModel} from './baseTextRendererModel';

export class RangeTextRendererModel extends BaseTextRendererModel {
  format: string | undefined;
  rangeValues: any = [];
}
