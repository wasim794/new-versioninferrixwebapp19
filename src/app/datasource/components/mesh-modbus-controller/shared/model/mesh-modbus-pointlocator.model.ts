import {PointLocatorModel} from "../../../../../core/models/dataPoint";

export class MeshModbusPointlocatorModel extends PointLocatorModel<MeshModbusPointlocatorModel> {
  public modelType = 'MODBUS_CONTROLLER.PL';
  public attributeId!: string;

  constructor(model?: Partial<MeshModbusPointlocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
