import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EnvService} from "../../core/services";
import {Observable} from "rxjs/Observable";
import {catchError, map} from "rxjs/operators";
import {AbstractDatasourceModel} from "../../core/models/dataSource";
import {ArrayWithTotalModel} from "../../core/models";
import {throwError} from "rxjs";
import {MqttConfigurationModel} from "../../adappt-integration";
import {Injectable} from "@angular/core";
@Injectable()
export class AdapptIntegrationService {
  integrationUrl = 'v2/adappt-integration';
  private _total: number;

  get total(): number {
    return this._total;
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  getMqttConfiguration(): Observable<MqttConfigurationModel> {
    return this.http
    .get<MqttConfigurationModel>(`${this.env.apiUrl}/${this.integrationUrl}/mqtt-configuration`)
    .pipe(map(result => new MqttConfigurationModel(result)),catchError(this.handleError));
  }

  saveMqttConfiguration(model: MqttConfigurationModel): Observable<MqttConfigurationModel> {
    return this.http
    .post<MqttConfigurationModel>(`${this.env.apiUrl}/${this.integrationUrl}/mqtt-configuration`, model.toJson())
    .pipe(map(value => new MqttConfigurationModel(value)));
  }

  enableMqttConfiguration(enabled: boolean) {
    return this.http.put(`${this.env.apiUrl}/${this.integrationUrl}/mqtt-configuration?enabled=${enabled}`, '');
  }

  getUnprovisionedDevices(params?: string): Observable<AbstractDatasourceModel<any>[]> {
    let url = `${this.env.apiUrl}/${this.integrationUrl}/unprovisioned`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map(result => {
      this._total = result.total;
      return result.items.map(data => new AbstractDatasourceModel(data));
    }));
  }

  getProvisionedDevices(params?: string): Observable<AbstractDatasourceModel<any>[]> {
    let url = `${this.env.apiUrl}/${this.integrationUrl}/provisioned`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map(result => {
      this._total = result.total;
      return result.items.map(data => new AbstractDatasourceModel(data));
    }));
  }

  provisionDevice(id: number): Observable<AbstractDatasourceModel<any>> {
    return this.http
    .put<AbstractDatasourceModel<any>>(`${this.env.apiUrl}/${this.integrationUrl}/provision/${id}`, '')
    .pipe(map(result => new AbstractDatasourceModel<any>(result)));
  }

  deleteProvisionedDevice(id: any): Observable<AbstractDatasourceModel<any>> {
    return this.http
    .delete<AbstractDatasourceModel<any>>(`${this.env.apiUrl}/${this.integrationUrl}/unprovision/${id}`)
    .pipe(map(result => new AbstractDatasourceModel<any>(result)));
  }

  private handleError<T>(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError('Some internal issue with making API Call ' + errorMessage);
  }

}
