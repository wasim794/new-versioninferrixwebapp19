import {RecipientEntryModel} from './recipient-entry.model';

export class UserPhoneNumberEntryModel extends RecipientEntryModel<UserPhoneNumberEntryModel> {
  public username!: string;
  public override recipientType = 'USER_PHONE_NUMBER';

  constructor(model?: Partial<UserPhoneNumberEntryModel>) {
    super(model);
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
