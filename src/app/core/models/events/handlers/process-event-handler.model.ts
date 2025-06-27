import {AbstractEventHandlerModel} from './abstract-event-handler.model';

export class ProcessEventHandlerModel extends AbstractEventHandlerModel<ProcessEventHandlerModel> {
  public override handlerType = 'PROCESS_HANDLER';
  public activeProcessCommand!: string;
  public activeProcessTimeout = 15;
  public inactiveProcessCommand!: string;
  public inactiveProcessTimeout = 15;

  constructor(model?: Partial<ProcessEventHandlerModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
