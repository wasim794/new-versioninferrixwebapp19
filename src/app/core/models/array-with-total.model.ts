export class ArrayWithTotalModel<T> {
  public items!: T[];
  public total!: number;

  constructor(model?: Partial<T>) {
    Object.assign(this, model);
  }
}
