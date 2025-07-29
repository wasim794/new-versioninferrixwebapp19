import {ApiService} from '../../../core/services';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  private licenseKeyUrl = '/v2/system-setting/license-key';

  constructor(
    private api: ApiService
  ) {
  }

  getLicenseKey(): Observable<any> {
    return this.api.get(`${this.licenseKeyUrl}`);
  }
}
