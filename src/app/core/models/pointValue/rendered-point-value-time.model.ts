import {RenderedPointValueModel} from "./rendered-point-value.model";

export class RenderedPointValueTimeModel {
  pointValue!: RenderedPointValueModel;
  timestamp!: string;

  constructor(model?: Partial<RenderedPointValueTimeModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
