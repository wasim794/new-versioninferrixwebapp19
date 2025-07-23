export class FtdmaTableModel {
  ftdmaSlotInfo1: number;
  ftdmaSlotInfo2: number;
  ftdmaSlotInfo3: number;
  ftdmaSlotInfo4: number;
  ftdmaSlotInfo5: number;

  constructor(model ?: Partial<FtdmaTableModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
