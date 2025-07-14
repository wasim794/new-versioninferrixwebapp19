import {DuplicateHandling} from './duplicateHandling';

export class AbstractEventTypeModel {
  eventType!: string;
  subType!: string;
  duplicateHandling!: DuplicateHandling;
  referenceId1!: number;
  referenceId2!: number;
  rateLimited!: boolean;
}
