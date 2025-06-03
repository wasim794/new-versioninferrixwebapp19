import {BaseTextRendererModel} from './base-text-renderer.model';

export class MultistateTextRendererModel extends BaseTextRendererModel<MultistateTextRendererModel> {
  public multistateValues!: MultistateValue[];

  constructor(model?: Partial<MultistateTextRendererModel>) {
    super(model);

    if (model?.multistateValues) {
      this.multistateValues = model.multistateValues.map(value => new MultistateValue(value));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}

export class MultistateValue {
  public key!: number;
  public text!: string;
  public colour!: string;

  constructor(model?: MultistateValue) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
