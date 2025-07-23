import {MeshScratchpadStatusModel} from "./mesh-scratchpad-status.model";

export class ScratchpadDataModel {
  totalMeshNodes: number;
  updatedMeshNodes: number;
  sequenceNumber: number;
  legacyUpdate: boolean;
  appAreaIds: string[];
  statusModel: MeshScratchpadStatusModel;

  constructor(model?: ScratchpadDataModel) {
    if (model) {
      Object.assign(this, model);
    }

    if (this.statusModel) {
      this.statusModel = new MeshScratchpadStatusModel(this.statusModel);
    }
  }
}
