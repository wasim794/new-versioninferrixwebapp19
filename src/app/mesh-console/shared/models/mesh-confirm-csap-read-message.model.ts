import {BaseConfirmMessageModel} from "./base-confirm-message.model";
import {CsapReadConfirmModel} from "./csap/csap-read-confirm.model";

export class MeshConfirmCsapReadMessageModel {
  isComplete!: boolean;
  confirmMessage!: CsapReadConfirmModel;

  constructor(model?: Partial<MeshConfirmCsapReadMessageModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
