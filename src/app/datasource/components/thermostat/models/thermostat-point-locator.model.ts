import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class ThermostatPointLocatorModel extends PointLocatorModel<ThermostatPointLocatorModel> {
  public modelType = 'THERMOSTAT.PL';
  public attributeId!: string;

  constructor(model?: Partial<ThermostatPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
