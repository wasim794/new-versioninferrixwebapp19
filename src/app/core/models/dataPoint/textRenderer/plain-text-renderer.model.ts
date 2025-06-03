import {BaseTextRendererModel} from './base-text-renderer.model';

export class PlainTextRendererModel extends BaseTextRendererModel<PlainTextRendererModel> {
  public suffix!: string;

  constructor(model?: Partial<PlainTextRendererModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
