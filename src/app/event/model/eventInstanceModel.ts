import {MessageTranslation} from '../../common/i18n/messageTranslation';
import {AbstractEventTypeModel} from '../../events/model/abstractEventTypeModel';


export class EventInstanceModel {
  id!: number;
  eventType!: AbstractEventTypeModel;
  activeTimestamp: any;
  acknowledgedByUserId!: number;
  acknowledgedByUsername!: string;
  acknowledgedTimestamp: any;
  rtnApplicable!: boolean;
  rtnTimestamp: any;
  alarmLevel!: string;
  message!: MessageTranslation;
  rtnMessage!: MessageTranslation;
  comments!: [any];
}
