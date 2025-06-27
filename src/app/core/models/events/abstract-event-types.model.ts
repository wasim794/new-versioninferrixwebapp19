import {DuplicateHandling} from './duplicate-handling';
import {EventTypeMatcherModel} from './event-type-matcher.model';

export abstract class AbstractEventTypesModel<T> {
  public eventType!: string;
  public subType!: string;
  public duplicateHandling!: DuplicateHandling;
  public referenceId1!: number;
  public referenceId2!: number;
  public rateLimited!: boolean;

  constructor(model?: Partial<T>) {
    if (model) {
      Object.assign(this, model);
    }
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }

  public toEventTypeMatcherModel(): EventTypeMatcherModel {
    const matcherModel:any = new EventTypeMatcherModel();
    matcherModel.eventType = this.eventType;
    matcherModel.subType = this.subType;
    matcherModel.referenceId1 = this.referenceId1;
    matcherModel.referenceId2 = this.referenceId2;
    return matcherModel;
  }
}
