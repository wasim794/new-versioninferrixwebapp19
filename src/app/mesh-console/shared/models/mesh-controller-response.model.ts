export class MeshControllerResponseModel {
  public isComplete: boolean;
  public responseMessage: string;
  public address: number;


  constructor(model: Partial<MeshControllerResponseModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
