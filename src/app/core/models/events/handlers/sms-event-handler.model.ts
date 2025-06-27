import {TimePeriodModel} from '../../timePeriod';
import {AbstractEventHandlerModel} from './abstract-event-handler.model';
import {PhoneNumberEntryModel, RecipientEntryModel, UserPhoneNumberEntryModel} from '../../alertList';
export class SmsEventHandlerModel extends AbstractEventHandlerModel<SmsEventHandlerModel> {
  public override handlerType = 'SMS_HANDLER';
  public activeRecipients?: RecipientEntryModel<any>[];
  public sendEscalation!: boolean;
  public escalationPeriod?: TimePeriodModel;
  public escalationRecipients?: RecipientEntryModel<any>[];
  public sendInactive!: boolean;
  public inactiveOverride!: boolean;
  public inactiveRecipients?: RecipientEntryModel<any>[];
  public customTemplate!: string;
  public subject!: string;
  constructor(model?: Partial<SmsEventHandlerModel>) {
    super(model);
 

    if (model && model.activeRecipients) {
      this.activeRecipients = model.activeRecipients.map((active) => {
        if (active.recipientType === 'PHONE_NUMBER') {
          return new PhoneNumberEntryModel(active);
        } else {
          return new UserPhoneNumberEntryModel(active);
        }
      });
    }

    if (model && model.escalationRecipients) {
      this.escalationRecipients = model.escalationRecipients.map((escalation) => {
        if (escalation.recipientType === 'PHONE_NUMBER') {
          return new PhoneNumberEntryModel(escalation);
        } else {
          return new UserPhoneNumberEntryModel(escalation);
        }
      });
    }

    if (model && model.inactiveRecipients) {
      this.inactiveRecipients = model.inactiveRecipients.map((inactive) => {
        if (inactive.recipientType === 'PHONE_NUMBER') {
          return new PhoneNumberEntryModel(inactive);
        } else {
          return new UserPhoneNumberEntryModel(inactive);
        }
      });
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
