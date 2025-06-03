export class StringStringPairModel {
  key!: string;
  value!: string;

  constructor(model?: Partial<StringStringPairModel>) {
    if(model) {
      Object.assign(this, model);
    }
  }
}
