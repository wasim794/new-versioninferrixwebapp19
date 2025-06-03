export class ModbusNodeScanResultModel {
  public nodesFound!: number[];

  constructor(model ?: Partial<ModbusNodeScanResultModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
