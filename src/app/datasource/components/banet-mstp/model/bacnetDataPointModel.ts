import {DataPointModel} from "../../../model";

export class BacnetDataPointModel extends DataPointModel {
  modelType!: string;
  dataType!: string;
  remoteDeviceInstanceNumber!: number;
  objectTypeId!: string;
  objectInstanceNumber!: number;
  propertyIdentifierId!: string;
  useCovSubscription!: boolean;
  writePriority!: number;
  multiplier!: number;
  additive!: number;
}
