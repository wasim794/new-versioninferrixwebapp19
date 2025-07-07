import {
  AbstractPollingDatasourceModel
} from "../../../../core/models/dataSource/abstract-polling-datasource.model";
import {LogLevel, ScriptContextVariableModel} from "../../../../core/models/scripts";
import {ContextUpdateEvent} from "../../../../common/static-data/static-data";

export class ScriptingDatasourceModel extends AbstractPollingDatasourceModel<ScriptingDatasourceModel> {
  public override modelType = 'SCRIPTING.DS';
  public context!: ScriptContextVariableModel[];
  public script!: string;
  public executionDelaySeconds!: number;
  public logLevel!: LogLevel;
  public logSize!: number;
  public logCount!: number;
  public historicalSetting!: boolean;
  public scriptPermissions!: string;
  public updateEvent!: ContextUpdateEvent
  public polling!: boolean;

  constructor(model?: Partial<ScriptingDatasourceModel>) {
    super(model);

    if (this.context) {
      this.context = this.context.map((contextVar) => new ScriptContextVariableModel(contextVar));
    }
  }

  override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
