import {BaseTextRendererModel} from './baseTextRendererModel';

export class TimeTextRendererModel extends BaseTextRendererModel {
  format!: string;
  conversionExponent: number | undefined;
}
