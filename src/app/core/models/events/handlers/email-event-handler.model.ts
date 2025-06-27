import {TimePeriodModel} from '../../timePeriod';
import {AbstractEventHandlerModel} from './abstract-event-handler.model';
import {
  EmailAddressEntryModel,
  RecipientEntryModel,
  UserEmailAddressEntryModel
} from '../../alertList';

export class EmailEventHandlerModel extends AbstractEventHandlerModel<EmailEventHandlerModel> {
  public override handlerType= 'EMAIL_HANDLER';
  public activeRecipients?: RecipientEntryModel<any>[];
  public sendEscalation!: boolean;
  public escalationPeriod?: TimePeriodModel;
  public escalationRecipients?: RecipientEntryModel<any>[];
  public sendInactive!: boolean;
  public inactiveOverride!: boolean;
  public inactiveRecipients?: RecipientEntryModel<any>[];
  public customTemplate!: string;
  public subject!: string;

  constructor(model?: Partial<EmailEventHandlerModel>) {
    super(model);
    if (model && model.escalationPeriod) {
      this.escalationPeriod = new TimePeriodModel(model.escalationPeriod);
    }

    if (model && model.activeRecipients) {
      this.activeRecipients = model.activeRecipients.map((active) => {
        if (active.recipientType === 'EMAIL_ADDRESS') {
          return new EmailAddressEntryModel(active);
        } else {
          return new UserEmailAddressEntryModel(active);
        }
      });
    }

    if (model && model.escalationRecipients) {
      this.escalationRecipients = model.escalationRecipients.map((escalation) => {
        if (escalation.recipientType === 'EMAIL_ADDRESS') {
          return new EmailAddressEntryModel(escalation);
        } else {
          return new UserEmailAddressEntryModel(escalation);
        }
      });
    }

    if (model && model.inactiveRecipients) {
      this.inactiveRecipients = model.inactiveRecipients.map((inactive) => {
        if (inactive.recipientType === 'EMAIL_ADDRESS') {
          return new EmailAddressEntryModel(inactive);
        } else {
          return new UserEmailAddressEntryModel(inactive);
        }
      });
    }
  }

  public override  toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
