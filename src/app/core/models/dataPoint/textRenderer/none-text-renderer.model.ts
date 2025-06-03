import {BaseTextRendererModel} from './base-text-renderer.model';

export class NoneTextRendererModel extends BaseTextRendererModel<NoneTextRendererModel> {
  constructor(model?: Partial<NoneTextRendererModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
