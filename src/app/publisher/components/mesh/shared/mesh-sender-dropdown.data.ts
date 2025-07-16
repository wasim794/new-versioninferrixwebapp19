import {StaticData} from "../../../../common";
import {SNAPSHOT_PERIOD, UPDATE_EVENTS} from '../../../shared';
import {ATTRIBUTE_TYPE} from "./mesh-sender-static.data";

export class MeshSenderDropdownData {
  private _attributeType: StaticData[] = ATTRIBUTE_TYPE;
  private _snapShotPeriod = SNAPSHOT_PERIOD;
  private  _updateEvents = UPDATE_EVENTS;

  get attributeType(): StaticData[] {
    return this._attributeType;
  }
  get snapShotPeriod(): StaticData[] {
    return this._snapShotPeriod;
  }
  get updateEvents(): StaticData[] {
    return this._updateEvents;
  }
}
