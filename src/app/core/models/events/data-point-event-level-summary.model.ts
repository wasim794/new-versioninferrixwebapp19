export class DataPointEventLevelSummaryModel {
  xid!: string;
  count!: [];

  constructor(model?: Partial<DataPointEventLevelSummaryModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
