import {PointLocatorModel} from '../../../../core/models/dataPoint';

export class SnmpPointLocatorModel extends PointLocatorModel<SnmpPointLocatorModel> {
  public modelType = 'SNMP.PL';
  public oid!: string;
  public binary0Value = '0';
  public setType!: string;
  public trapOnly!: boolean;
  public multiplicand = 1.0;
  public augend = 0.0;

  constructor(model?: Partial<SnmpPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
