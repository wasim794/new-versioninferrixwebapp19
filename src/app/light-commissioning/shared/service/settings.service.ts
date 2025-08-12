import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BacnetPublisherSettingsSummaryModel} from '../model';
import {EnvService} from '../../../core/services';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private url = '/v2/light-commissioning/publish/bacnet';

  constructor(
    private http: HttpClient,
    private env: EnvService,
  ) {
  }

  publishLightNodePoints(localNetworkNumber: string): Observable<BacnetPublisherSettingsSummaryModel> {
    return this.http.put<BacnetPublisherSettingsSummaryModel>(`${this.env.apiUrl}${this.url}/${localNetworkNumber}`, '')
    .pipe(map(model => new BacnetPublisherSettingsSummaryModel(model)));
  }

  getPublisher(): Observable<BacnetPublisherSettingsSummaryModel> {
    return this.http.get<BacnetPublisherSettingsSummaryModel>(`${this.env.apiUrl}${this.url}`)
    .pipe(map((model) => new BacnetPublisherSettingsSummaryModel(model)));
  }

  deletePublisher(): Observable<BacnetPublisherSettingsSummaryModel> {
    return this.http.delete<BacnetPublisherSettingsSummaryModel>(`${this.env.apiUrl}${this.url}`)
    .pipe(map((model) => new BacnetPublisherSettingsSummaryModel(model)));
  }
}
