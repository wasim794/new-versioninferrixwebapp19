import {BasicModel} from "../../../core/models";

export class GlobalScriptModel extends BasicModel<GlobalScriptModel> {
  script!: string;

  constructor(model: Partial<GlobalScriptModel>) {
    super(model);
  }

  override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
