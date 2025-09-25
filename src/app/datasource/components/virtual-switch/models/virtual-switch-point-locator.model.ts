import {PointLocatorModel} from "../../../../core/models/dataPoint";


export class VirtualSwitchPointLocatorModel extends PointLocatorModel<VirtualSwitchPointLocatorModel> {
  public modelType = 'VIRTUAL_SWITCH.PL';
  public declare controlCommand:number;



  constructor(model?: Partial<VirtualSwitchPointLocatorModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }

}
