import {BaseConfirmMessageModel} from "../base-confirm-message.model";

export class CsapReadConfirmModel extends BaseConfirmMessageModel {
  attributeName: string;
  attributeValue: any;

  constructor(model?: Partial<CsapReadConfirmModel>) {
    super(model)
  }
}
