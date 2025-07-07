import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class ScriptingPointLocatorModel extends PointLocatorModel<ScriptingPointLocatorModel> {
  public modelType = 'SCRIPTING.PL';
  public varName!: string;
  public contextUpdate!: boolean;

  constructor(model?: Partial<ScriptingPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
