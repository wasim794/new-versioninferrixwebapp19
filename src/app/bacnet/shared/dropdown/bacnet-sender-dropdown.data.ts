import {SNAPSHOT_PERIOD, UPDATE_EVENTS} from '../../../publisher/shared';
import {StaticData} from '../../../common';

export class BacnetSenderDropdownData {
  private _updateEvents = UPDATE_EVENTS;
  private _snapShotPeriod = SNAPSHOT_PERIOD;

  get updateEvents(): StaticData[] {
    return this._updateEvents;
  }

  get snapShotPeriod(): StaticData[] {
    return this._snapShotPeriod;
  }


}

export const NOTIFY_TYPE: StaticData[] = [
  {value: 'alarm', key: 'Alarm'},
  {value: 'event', key: 'Event'},
  {value: 'ackNotification', key: 'Acknowledge Notification'}
];
