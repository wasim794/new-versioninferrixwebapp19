import {PointLocatorModel} from "../../../../../core/models/dataPoint";


export class SoapDispenserPointLocatorModel extends PointLocatorModel<SoapDispenserPointLocatorModel> {
  public modelType = 'SOAP_DISPENSER_SENSOR.PL';
  public attributeId!: string

  constructor(model?: Partial<SoapDispenserPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
