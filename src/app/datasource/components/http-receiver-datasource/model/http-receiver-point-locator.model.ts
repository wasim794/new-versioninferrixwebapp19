import {PointLocatorModel} from '../../../../core/models/dataPoint';

export class HttpReceiverPointLocatorModel extends PointLocatorModel<HttpReceiverPointLocatorModel> {
  public modelType = 'HTTP_RECEIVER.PL';
  public parameterName!: string;
  public binary0Value!: string;

  constructor(model?: Partial<HttpReceiverPointLocatorModel>) {
    super(model);
    this.parameterName = model?.parameterName ?? '';
    this.parameterName = model?.parameterName ?? '';
  }

  public override toJson(): any {
    return {
      ...super.toJson(), // Include parent properties// Spread the properties from the base class
      modelType: this.modelType,
      parameterName: this.parameterName,
      binary0Value: this.binary0Value,
    };
  }
}







