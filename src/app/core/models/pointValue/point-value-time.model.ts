export class PointValueTimeModel {
  dataType!: string;
  value: any;
  timestamp!: number;
  annotation!: string;


  constructor(model?: Partial<PointValueTimeModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
