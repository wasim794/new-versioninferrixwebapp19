import {BasicModel} from "../../../core/models";


export class MeshNodeInfoModel extends BasicModel<MeshNodeInfoModel> {
  address: number;
  travelTime: number;
  nodeType: string;
  appVersion: string;
  hardwareVersion: string;
  manufacturerName: string;
  wirepasVersion: string;
  attributeAdded: string;
  applicationVersion: string;

  constructor(model?: Partial<MeshNodeInfoModel>) {
    super(model);
  }
}
