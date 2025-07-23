export class BaseConfirmMessageModel {
  messageType: string;
  message: string;

  constructor(model?: Partial<BaseConfirmMessageModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
