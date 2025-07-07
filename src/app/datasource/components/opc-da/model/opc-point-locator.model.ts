import {PointLocatorModel} from "../../../../core/models/dataPoint";

export class OpcPointLocatorModel extends PointLocatorModel<OpcPointLocatorModel> {
  public tag!: string;
  public modelType = 'OPC.PL';

  constructor(model?: Partial<OpcPointLocatorModel>) {
    super(model);
  }
}
