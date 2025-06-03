import {PointValueTimeModel} from "./point-value-time.model";
import {RenderedPointValueTimeModel} from "./rendered-point-value-time.model";
import {DataPointModel} from "../dataPoint";

export class PointValueTimeNameXidModel {
  xid: string;
  name: string;
  settable: boolean;
  enabled: boolean;
  value: PointValueTimeModel;
  renderedValue: RenderedPointValueTimeModel;

  constructor(model?: Partial<DataPointModel>) {
    if (model) {
      this.xid = model.xid;
      this.name = model.name;
      this.settable = model.settable;
      this.enabled = model.enabled;
    }
  }
}
