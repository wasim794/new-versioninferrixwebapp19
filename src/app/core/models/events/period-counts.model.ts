import {StringIntPairModel} from '../pair/string-int-pair.model';

export class PeriodCountsModel {
  from!: string;
  to!: string;
  active!: AlarmCountModel;
  unacknowledged!: AlarmCountModel;
  total!: AlarmCountModel;

  constructor(model?: Partial<PeriodCountsModel>) {
    if (model) {
      Object.assign(this, model);
    }

    if (model && model.active) {
      this.active = new AlarmCountModel(model.active);
    }

    if (this.unacknowledged) {
      this.unacknowledged = new AlarmCountModel(model?.unacknowledged);
    }

    if (this.total) {
      this.total = new AlarmCountModel(model?.total);
    }
  }
}

export class AlarmCountModel {
  count!: StringIntPairModel[];

  constructor(model?: Partial<any>) {
    if (model) {
      this.count = model['map']((data: any) => new StringIntPairModel(data.key, data.value));
    }
  }
}
