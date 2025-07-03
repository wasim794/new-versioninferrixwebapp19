import {TemporaryResourceStatus} from "./temporary-resource-status";

export class TemporaryResourceSubscriptionModel {
  requestType = 'SUBSCRIPTION';
  ownResourcesOnly: boolean = true;
  showResultWhenIncomplete: boolean = false;
  showResultWhenComplete: boolean = false;
  anyStatus: boolean = false;
  anyResourceType: boolean = false;
  statuses: Array<TemporaryResourceStatus> = new Array<TemporaryResourceStatus>();
  resourceTypes: Array<string> = new Array<string>();

  constructor(model?: Partial<TemporaryResourceSubscriptionModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
