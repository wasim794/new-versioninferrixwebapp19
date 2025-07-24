import {RecipientEntryModel} from './recipient-entry.model';

export class EmailAddressEntryModel extends RecipientEntryModel<EmailAddressEntryModel> {
  public address!: string;
  public override recipientType = 'EMAIL_ADDRESS';

  constructor(model?: Partial<EmailAddressEntryModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
