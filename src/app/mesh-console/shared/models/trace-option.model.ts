export class TraceOptionModel {
  traceType: string;
  sequence: number;

  constructor(model?: Partial<TraceOptionModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
