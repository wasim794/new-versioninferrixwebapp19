import {TimePeriodModel} from '../timePeriod';
import {AbstractDatasourceModel} from './abstract-datasource.model';

export abstract class AbstractPollingDatasourceModel<T extends AbstractPollingDatasourceModel<T>> extends AbstractDatasourceModel<T> {
  public quantize!: boolean;
  public timePeriod!: TimePeriodModel;

  constructor(model?: Partial<T>) {
    super(model);
    if (this.timePeriod) {
      this.timePeriod = new TimePeriodModel(model?.timePeriod);
    }
  }

  public override toJson(): any {
    super.toJson();
    return JSON.parse(JSON.stringify(this));
  }
}
