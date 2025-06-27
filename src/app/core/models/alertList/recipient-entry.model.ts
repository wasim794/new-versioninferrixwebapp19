export abstract class RecipientEntryModel<T> {
  public recipientType: string;

  constructor(model?: Partial<T>) {
    Object.assign(this, model);
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
