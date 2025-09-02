import {BasicModel} from "../../core/models";

export class ModbusDeviceDetailsModel extends BasicModel<ModbusDeviceDetailsModel> {
  type!: string;
  attributes!: Array<number>;
  editPermissions!: string;
  queryData: any;
  writeData!: null;
  pointDetails: any;
  


  constructor(model: Partial<ModbusDeviceDetailsModel>) {
    super(model);

    if (model.attributes) {
      this.attributes = new Array<number>();
      model.attributes.map(value => this.attributes.push(value));
    }
  }

  override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }

  save(modbusDevice: ModbusDeviceDetailsModel) {
    
  }
}
