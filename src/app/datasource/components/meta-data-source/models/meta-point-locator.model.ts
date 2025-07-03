import {PointLocatorModel} from "../../../../core/models/dataPoint";
import {LogLevel, ScriptContextVariableModel} from "../../../../core/models/scripts";

export class MetaPointLocatorModel extends PointLocatorModel<MetaPointLocatorModel> {
  public modelType = 'META.PL';
  public script!: string;
  public scriptEngine!: string;
  public updateEvent!: string;
  public updateCronPattern!: string;
  public executionDelaySeconds!: number;
  public variableName!: string;
  public context!: ScriptContextVariableModel[];
  public scriptPermissions!: string;
  public contextUpdateEvent!: string;
  public logLevel!: LogLevel;
  public logSize!: number;
  public logCount!: number;

  constructor(model?: Partial<any>) {
    super(model);

    if (this.context) {
      this.context = model?.["context"].map((contextVar: Partial<ScriptContextVariableModel>) => new ScriptContextVariableModel(contextVar));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
