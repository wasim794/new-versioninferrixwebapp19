import {AbstractEventTypesModel} from './abstract-event-types.model';
import {ReturnCause} from './return-cause.enum';
import {UserCommentsModel} from '../comments';

export class EventInstanceModel {
  public id!: number;
  public eventType!: AbstractEventTypesModel<any>;
  public activeTimestamp: any;
  public acknowledgedByUserId!: number;
  public acknowledgedByUsername!: string;
  public acknowledgedTimestamp: any;
  public rtnApplicable!: boolean;
  public rtnTimestamp: any;
  public rtnCause!: ReturnCause;
  public alarmLevel!: string;
  public message!: string;
  public rtnMessage!: string;
  public comments!: UserCommentsModel[];

  constructor(model?: Partial<EventInstanceModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model && model.comments) {
      this.comments = model.comments.map((comment) => new UserCommentsModel(comment));
    }
  }
}
