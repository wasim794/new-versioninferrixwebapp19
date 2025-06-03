import {BaseTextRendererModel} from './base-text-renderer.model';

export class TimeTextRendererModel extends BaseTextRendererModel<TimeTextRendererModel> {
  public format!: string;
  public conversionExponent!: number;

  constructor(model?: Partial<TimeTextRendererModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
