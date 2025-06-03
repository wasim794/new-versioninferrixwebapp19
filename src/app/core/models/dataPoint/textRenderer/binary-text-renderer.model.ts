import {BaseTextRendererModel} from './base-text-renderer.model';

export class BinaryTextRendererModel extends BaseTextRendererModel<BinaryTextRendererModel> {
  public zeroLabel!: string;
  public zeroColour!: string;
  public oneLabel!: string;
  public oneColour!: string;

  constructor(model?: Partial<BinaryTextRendererModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
