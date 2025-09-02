export class CommandModel {
  enabled!: boolean;
  sourceAddress!: number;
  destinationAddress!: number;

  constructor(model?: Partial<CommandModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
