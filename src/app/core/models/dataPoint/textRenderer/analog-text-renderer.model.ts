import {BaseTextRendererModel} from './base-text-renderer.model';

export class AnalogTextRendererModel extends BaseTextRendererModel<AnalogTextRendererModel> {
  public format!: string;
  public suffix!: string;

  constructor(model?: Partial<AnalogTextRendererModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
