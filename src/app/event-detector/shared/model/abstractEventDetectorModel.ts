import {BasicModel} from '../../../common/model/basicModel';
import {MessageTranslation} from '../../../common/i18n/messageTranslation';

export class AbstractEventDetectorModel extends BasicModel {
  action!: string;
  body!: object;
  sourceId!: string;
  description!: MessageTranslation;
  rtnApplicable!: boolean;
  alarmLevel!: string;
  sourceTypeName!: string;
  handlerXids: any = [];
}
