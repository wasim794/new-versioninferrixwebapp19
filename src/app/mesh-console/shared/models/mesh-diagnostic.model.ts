import {BootV2DataModel} from "./boot-v2-data.model";
import {DiagnosticV2DataModel} from "./diagnostic-v2-data.model";

export class MeshDiagnosticModel {
  address: number;
  timestamp: number;
  nodeType: string;
  bootData: BootV2DataModel;
  diagnosticsData: DiagnosticV2DataModel;

  constructor(model?: Partial<MeshDiagnosticModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (this.bootData) {
      this.bootData = new BootV2DataModel(model.bootData);
    } else {
      this.bootData = new BootV2DataModel();
    }

    if (this.diagnosticsData) {
      this.diagnosticsData = new DiagnosticV2DataModel(model.diagnosticsData);
    } else {
      this.diagnosticsData = new DiagnosticV2DataModel();
    }
  }
}
