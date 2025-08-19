export class ModbusControllerResponseModel {
  controllerId: number;
  name: string;
  address: number;
  responseMessage: string;
  complete: boolean;
  startTime: number;
  timeout: number;

  constructor(model?: Partial<ModbusControllerResponseModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
