import {BasicModel} from "../../core/models";
import {MqttIntegrationModel} from "./mqtt-integration.model";

export class DeviceTypeModel extends BasicModel<DeviceTypeModel> {
  type!: string;
  data= new MqttIntegrationModel();

  constructor(model?: Partial<DeviceTypeModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
