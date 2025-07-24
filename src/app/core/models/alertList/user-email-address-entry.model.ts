import {RecipientEntryModel} from './recipient-entry.model';

export class UserEmailAddressEntryModel extends RecipientEntryModel<UserEmailAddressEntryModel> {
  public username!: string;
  public override recipientType = 'USER_EMAIL_ADDRESS';

  constructor(model?: Partial<UserEmailAddressEntryModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
