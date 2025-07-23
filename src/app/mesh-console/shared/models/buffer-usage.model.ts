export class BufferUsageModel {
  average: number;
  maximum: number;

  constructor(model?: Partial<BufferUsageModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
