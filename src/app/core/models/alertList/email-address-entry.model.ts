import {RecipientEntryModel} from './recipient-entry.model';

export class EmailAddressEntryModel extends RecipientEntryModel<EmailAddressEntryModel> {
  public address: string;
  public recipientType = 'EMAIL_ADDRESS';

  constructor(model?: Partial<EmailAddressEntryModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
