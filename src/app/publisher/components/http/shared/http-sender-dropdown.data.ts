import {SNAPSHOT_PERIOD, UPDATE_EVENTS} from '../../../shared/publisher-static.data';
import {DATE_FORMATS, HTTP_METHODS} from './http-sender-static.data';
import {BooleanStaticData, StaticData} from '../../../../common/static-data/static-data';

export class HttpSenderDropdownData {
  private _updateEvents = UPDATE_EVENTS;
  private _snapShotPeriod = SNAPSHOT_PERIOD;
  private _httpMethods = HTTP_METHODS;
  private _dateFormats = DATE_FORMATS;

  get updateEvents(): StaticData[] {
    return this._updateEvents;
  }

  get snapShotPeriod(): StaticData[] {
    return this._snapShotPeriod;
  }

  get httpMethods(): BooleanStaticData[] {
    return this._httpMethods;
  }

  get dateFormats(): StaticData[] {
    return this._dateFormats;
  }
}
