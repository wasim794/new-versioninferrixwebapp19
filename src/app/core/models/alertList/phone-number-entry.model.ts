import {RecipientEntryModel} from './recipient-entry.model';

export class PhoneNumberEntryModel extends RecipientEntryModel<PhoneNumberEntryModel> {
  public number: string;
  public recipientType = 'PHONE_NUMBER';

  constructor(model?: Partial<PhoneNumberEntryModel>) {
    super(model);
  }

  public toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
