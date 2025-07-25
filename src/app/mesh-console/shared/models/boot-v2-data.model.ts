import {TraceOptionModel} from "./trace-option.model";
import {TxPowerTableModel} from "./tx-power-table.model";
import {ScratchpadDetailsModel} from "./scratchpad-details.model";

export class BootV2DataModel {
  role!: string
  bootCount!: number;
  firmwareStack!: string;
  firmwareApp!: string;
  scratchpadProcessedSequence!: number;
  scratchpadStoredSequence!: number;
  otapSupport!: boolean;
  hardwareMagic!: number;
  bootAddress!: number;
  bootFaultReason!: number;
  bootLineNumber!: number;
  bootFilenameHash!: number;
  stackProfile!: string;
  traceOptions: TraceOptionModel;
  scratchPadXferCnt!: number;
  bootReason!: number;
  txPowerTable: TxPowerTableModel;
  rxGain!: number;
  scratchPadDetails: ScratchpadDetailsModel;

  constructor(model?: Partial<BootV2DataModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model?.traceOptions) {
      this.traceOptions = new TraceOptionModel(model.traceOptions);
    } else {
      this.traceOptions = new TraceOptionModel();
    }

    if (model?.txPowerTable) {
      this.txPowerTable = new TxPowerTableModel(model.txPowerTable);
    } else {
      this.txPowerTable = new TxPowerTableModel();
    }

    if (model?.scratchPadDetails) {
      this.scratchPadDetails = new ScratchpadDetailsModel(model.scratchPadDetails);
    } else {
      this.scratchPadDetails = new ScratchpadDetailsModel();
    }
  }
}
