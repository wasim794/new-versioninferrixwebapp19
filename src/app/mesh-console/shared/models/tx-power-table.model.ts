export class TxPowerTableModel {
  dBm1: number;
  dBm2: number;
  dBm3: number;
  dBm4: number;
  dBm5: number;
  dBm6: number;
  dBm7: number;
  dBm8: number;
  dBm9: number;

  constructor(model ?: Partial<TxPowerTableModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
