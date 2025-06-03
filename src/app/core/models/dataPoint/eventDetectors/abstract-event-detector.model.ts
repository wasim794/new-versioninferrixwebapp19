import {BasicModel} from "../../basic.model";

export abstract class AbstractEventDetectorModel<T extends AbstractEventDetectorModel<T>> extends BasicModel<T> {
  sourceId: string;
  description: string;
  rtnApplicable: boolean;
  alarmLevel: string;
  sourceTypeName: string;
  handlerXids: Array<string>;
  detectorType: string;

  constructor(model?: Partial<T>) {
    super(model);
  }

  public toJson(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
