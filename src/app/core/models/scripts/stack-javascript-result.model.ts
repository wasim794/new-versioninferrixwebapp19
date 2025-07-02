export class StackJavascriptResultModel {
  actions!: Array<StackJavaScriptAction>;
  errors!: Array<StackJavaScriptError>;
  scriptOutput!: string;
  result!: Object;

  constructor(model?: Partial<StackJavascriptResultModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model?.actions) {
      this.actions = model.actions.map(action => new StackJavaScriptAction(action));
    }

    if (model?.errors) {
      this.errors = model.errors.map(error => new StackJavaScriptError(error));
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

export class StackJavaScriptAction {
  message!: string;
  level!: Level

  constructor(model?: Partial<StackJavaScriptAction>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}

enum Level {
  info, warning, error
}

export class StackJavaScriptError {
  message!: string;
  lineNumber!: number;
  columnNumber!: number;

  constructor(model?: Partial<StackJavaScriptError>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
