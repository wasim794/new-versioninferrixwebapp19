import {RecipientEntryModel} from './recipient-entry.model';

export class UserPhoneNumberEntryModel extends RecipientEntryModel<UserPhoneNumberEntryModel> {
  public username: string;
  public recipientType = 'USER_PHONE_NUMBER';

  constructor(model?: Partial<UserPhoneNumberEntryModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
