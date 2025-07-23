export class CbmacDetailsModel {
  load: number;
  rxMessagesAck: number;
  rxMessagesUnack: number;
  rxAckOtherReasons: number;
  txAckCcaFail: number;
  txAckNotReceived: number;
  txMessagesAck: number;
  txMessagesUnack: number;
  txCcaUnackFail: number;

  constructor(model?: Partial<CbmacDetailsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
