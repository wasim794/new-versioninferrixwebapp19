import {BaseTextRendererModel} from './base-text-renderer.model';

export class RangeTextRendererModel extends BaseTextRendererModel<RangeTextRendererModel> {
  public format!: string;
  public rangeValues!: RangeValue[];

  constructor(model?: Partial<RangeTextRendererModel>) {
    super(model);

    if (model?.rangeValues) {
      this.rangeValues = model.rangeValues.map(value => new RangeValue(value));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}

export class RangeValue {
  public from!: number;
  public to!: number;
  public text!: string;
  public colour!: string;

   constructor(model?: Partial<RangeValue>) {
    if (model?.from !== undefined || model?.to !== undefined || model?.text !== undefined || model?.colour !== undefined) {
      Object.assign(this, model);
    }
  }
}
