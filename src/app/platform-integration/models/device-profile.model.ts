import {BasicModel} from "../../core/models";

export class DeviceProfileModel extends BasicModel<DeviceProfileModel> {
  description!    : string;
  type!           : string;
  transportType!  : string;
  provisionType!  : string;
  deviceProfileId!: string;

  constructor(model?: Partial<DeviceProfileModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
