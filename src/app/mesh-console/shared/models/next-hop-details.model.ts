export class NextHopDetailsModel {
  advertisedCost: number;
  sinkAddress: number;
  nextHopAddress: number;
  nextHopQuality: number;
  nextHopRssi: number;
  nextHopPower: number;

  constructor(model?: Partial<NextHopDetailsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
