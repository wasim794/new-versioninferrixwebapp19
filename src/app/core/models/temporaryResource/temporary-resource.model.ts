import {TemporaryResourceStatus} from "./temporary-resource-status";

export class TemporaryResourceModel<T, E> {
  resourceType!: string;
  id!: string;
  expiration!: number;
  timeout!: number;
  status!: TemporaryResourceStatus;
  resourceVersion!: number;
  result!: T;
  error!: E;
  startTime!: string;
  completionTime!: string;
  position!: number;
  maximum!: number;
  progress!: number;

  constructor(model?: Partial<TemporaryResourceModel<any, any>>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
