export class SetValueModel {
  dataType!: string;
  value: any;

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
