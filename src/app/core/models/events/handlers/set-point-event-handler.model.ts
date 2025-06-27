import {AbstractEventHandlerModel} from './abstract-event-handler.model';
export class SetPointEventHandlerModel extends AbstractEventHandlerModel<SetPointEventHandlerModel> {
  public override handlerType = 'SET_POINT_HANDLER';
  public targetPointXid!: string;
  public activeAction!: string;
  public activeValueToSet?: any;
  public activePointXid?: string;
  public inactiveAction!: string;
  public inactiveValueToSet?: any;
  public inactivePointXid?: string;

  constructor(model?: Partial<SetPointEventHandlerModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
