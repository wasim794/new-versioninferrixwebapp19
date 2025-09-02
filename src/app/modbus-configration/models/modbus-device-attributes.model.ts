import {BasicModel} from "../../core/models";

export class ModbusDeviceAttributesModel extends BasicModel<ModbusDeviceAttributesModel> {
  type!: string;
  pointsCount!: number;
  queryData!: ModbusQueryData;
  writeable!: boolean;
  pointDetails!: Map<number, ModbusDataModel>;
  editPermissions!: string;

  constructor(model: Partial<ModbusDeviceAttributesModel>) {
    super(model);

    if(model.queryData) {
      this.queryData = new ModbusQueryData(model.queryData);
    }

    if(model.pointDetails) {
      this.pointDetails = new Map<number, ModbusDataModel>();
      this.pointDetails.forEach((value, key) => {
        this.pointDetails.set(key, new ModbusDataModel(value));
      })
    }
  }

  override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}

export class ModbusQueryData {
  functionCode!: number;
  startAdd!: number;
  length!: number;

  constructor(model: Partial<ModbusQueryData>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}

export class ModbusDataModel {
  pointName!: string;
  pointSize!: string;
  dataType!: string;
  key!: string;

  constructor(model: Partial<ModbusDataModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
