export class StackJavascriptModel {
  wrapInFunction!: boolean;
  script!: string;
  context!: Array<ScriptContextVariableModel>;
  logLevel!: LogLevel;
  resultDataType!: string;
  permissions!:string;
  additionalContext!: Map<string, Object>;

  constructor(model?: Partial<StackJavascriptModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model?.context) {
      this.context = model.context.map(data => new ScriptContextVariableModel(data));
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

export class ScriptContextVariableModel {
  xid!: string;
  variableName!: string;
  contextUpdate!: boolean;

  constructor(model?: Partial<ScriptContextVariableModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}

export enum LogLevel {
  TRACE = 1,
  DEBUG = 2,
  INFO = 3,
  WARN = 4,
  ERROR = 5,
  FATAL = 6,
  NONE = 10
}
