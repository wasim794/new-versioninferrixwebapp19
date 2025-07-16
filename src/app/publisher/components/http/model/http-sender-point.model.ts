import {AbstractPublisherPointModel} from '../../../../core/models/publisher';

export class HttpSenderPointModel extends AbstractPublisherPointModel<HttpSenderPointModel> {
  public modelType = 'HTTP_SENDER.POINT';
  public parameterName!: string;
  public includeTimestamp!: boolean;
  public status!: boolean;
  public dataType!: string;

  constructor(model?: Partial<HttpSenderPointModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
