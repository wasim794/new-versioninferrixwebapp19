import {BaseConfirmMessageModel} from "./base-confirm-message.model";

export class MeshStackStatusConfirmMessageModel {
  isComplete!: boolean;
  confirmMessage!: BaseConfirmMessageModel;

  constructor(model?: Partial<MeshStackStatusConfirmMessageModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
