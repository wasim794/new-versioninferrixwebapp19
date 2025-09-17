import {MeshNodesDatasourceModel} from "../../../../../core/models/dataSource";

export class SoapDispenserDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType = 'SOAP_DISPENSER_SENSOR.DS';

  constructor(model?: Partial<SoapDispenserDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
