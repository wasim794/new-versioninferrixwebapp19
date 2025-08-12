export class NodeStatsModel {
  normal: number;
  total: number;
  discovered: number;
  ledController: number;
  relayController: number;
  mokoBand: number;
  down: number;
  commissioned: number;
  diController: number;
  enocean: number;
  sink: number;
  up: number;

  constructor(model?: Partial<NodeStatsModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
