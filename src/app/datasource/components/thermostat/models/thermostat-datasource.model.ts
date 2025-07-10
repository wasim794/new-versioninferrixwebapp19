import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

export class ThermostatDatasourceModel extends MeshNodesDatasourceModel {
  public override modelType: string = 'THERMOSTAT.DS';

  constructor(model?: Partial<ThermostatDatasourceModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
