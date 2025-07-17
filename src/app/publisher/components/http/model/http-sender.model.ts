import {AbstractPublisherModel} from '../../../../core/models/publisher';
import {HttpSenderPointModel} from './http-sender-point.model';

export class HttpSenderModel extends AbstractPublisherModel<HttpSenderModel> {
  public override modelType = 'HTTP_SENDER.PUB';
  public declare points: HttpSenderPointModel[];
  public dateFormat!: string;
  public raiseResultWarning!: boolean;
  public staticHeaders = [];
  public staticParameters = [];
  public usePost: any;
  public url!: string;

  constructor(model?: Partial<HttpSenderModel>) {
    super(model);

    if (model && model.points) {
      this.points = model.points.map((point) => new HttpSenderPointModel(point));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
