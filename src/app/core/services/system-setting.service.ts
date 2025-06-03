import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
// import {SystemSettingModel} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {

  private systemSettingsUrl = '/v2/system-setting';

  constructor(
    private api: ApiService,
  ) {}

  getSystemSettings(): Observable<any> {
    return this.api.get(`${this.systemSettingsUrl}`);
  }

  getSystemSettingsByKey(key: string) {
    return this.api.get(`${this.systemSettingsUrl}/${key}`);
  }

  saveSystemSettings(object: Object): Observable<any> {
    return this.api.post(`${this.systemSettingsUrl}`, object);
  }
}
