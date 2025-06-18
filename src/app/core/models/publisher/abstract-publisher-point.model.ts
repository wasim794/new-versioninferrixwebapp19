export abstract class AbstractPublisherPointModel<T extends AbstractPublisherPointModel<T>> {
  public id!: number;
  public xid!: string;
  public name!: string;
  public enabled!: boolean;
  public dataPointXid!: string;
  public publisherXid!: string;

  constructor(model?: Partial<T>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
