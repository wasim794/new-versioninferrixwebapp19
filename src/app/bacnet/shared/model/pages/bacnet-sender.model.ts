import {AbstractPublisherModel} from '../../../../core/models/publisher';
import {BacnetSenderPointModel} from './bacnet-sender-point.model';

export class BacnetSenderModel extends AbstractPublisherModel<BacnetSenderModel> {
  public localDeviceId!:string;
  public description: any;
  public connectionDescription: any;
  public declare points: BacnetSenderPointModel[];
  public override modelType = 'BACNET_SENDER.PUB';

  constructor(model?: Partial<BacnetSenderModel>) {
    super(model);

    if (model && model.points) {
      this.points = model.points.map((point) => new BacnetSenderPointModel(point));
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
