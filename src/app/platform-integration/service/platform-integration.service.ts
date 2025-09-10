import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EnvService} from "../../core/services";
import {Observable} from "rxjs";
import {MqttConnectionParametersModel} from "../models/mqtt-connection-parameters.model";
import {catchError, map} from "rxjs/operators";
import {PlatformDetailsModel} from "../models/platform-details.model";
import {DeviceTypeModel} from "../models/device-type.model";
import {AbstractDatasourceModel} from "../../core/models/dataSource";
import {ArrayWithTotalModel} from "../../core/models";
import {throwError} from "rxjs";
import {DeviceProfileModel} from "../models/device-profile.model";

@Injectable({
  providedIn: 'root'
})
export class PlatformIntegrationService {
  integrationUrl = '/v2/platform-integration';
  private _total!: number;

  get total(): number {
    return this._total;
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  getDeviceTypeKeys(): Observable<Map<string, string>> {
    return this.http
      .get<Map<string, string>>(`${this.env.apiUrl}${this.integrationUrl}/device-types`)
      .pipe();
  }

  getMqttConfiguration(): Observable<MqttConnectionParametersModel> {
    return this.http
      .get<MqttConnectionParametersModel>(`${this.env.apiUrl}${this.integrationUrl}/mqtt-configuration`)
      .pipe(map(result => new MqttConnectionParametersModel(result)));
  }

  saveMqttConfiguration(model: MqttConnectionParametersModel): Observable<MqttConnectionParametersModel> {
    return this.http
      .post<MqttConnectionParametersModel>(`${this.env.apiUrl}${this.integrationUrl}/mqtt-configuration`, model.toJson())
      .pipe(map(value => new MqttConnectionParametersModel(value)));
  }

  enableMqttConfiguration(enabled: boolean) {
    return this.http.put(`${this.env.apiUrl}${this.integrationUrl}/mqtt-configuration?enabled=${enabled}`, '');
  }

  getPlatformDetails(): Observable<PlatformDetailsModel> {
    return this.http
      .get<PlatformDetailsModel>(`${this.env.apiUrl}${this.integrationUrl}/server-details`)
      .pipe(map(value => new PlatformDetailsModel(value)));
  }

  savePlatformDetails(model: PlatformDetailsModel): Observable<PlatformDetailsModel> {
    return this.http
      .post<PlatformDetailsModel>(`${this.env.apiUrl}${this.integrationUrl}/server-details`, model.toJson())
      .pipe(map(value => new PlatformDetailsModel(value)));
  }

  getDeviceTypeSettings(): Observable<DeviceTypeModel> {
    return this.http
      .get<DeviceTypeModel>(`${this.env.apiUrl}${this.integrationUrl}/device-types`)
      .pipe(catchError(this.handleError));
  }

  saveDeviceTypeSettings(DeviceTypeModel: any): Observable<DeviceTypeModel> {
    return this.http
      .post<DeviceTypeModel>(`${this.env.apiUrl}${this.integrationUrl}/device-types`, DeviceTypeModel)
      .pipe(catchError(this.handleError));

  }
  updateDeviceTypeSettings(DeviceTypeModel: any): Observable<DeviceTypeModel> {
    return this.http
      .put<DeviceTypeModel>(`${this.env.apiUrl}${this.integrationUrl}/device-types/${DeviceTypeModel.id}`, DeviceTypeModel)
      .pipe(catchError(this.handleError));

  }

  getDeviceProfiles(params?: any): Observable<DeviceProfileModel> {
    let url = `${this.env.apiUrl}${this.integrationUrl}/device-profile`;
      if (params) {
        url = url + `?${params}`;
      }
      return this.http
        .get<any>(url)
        .pipe(map((result) => {
          this._total = result.total;
          return result.items;
        }));
  }



  saveDeviceProfile(model: DeviceProfileModel): Observable<DeviceProfileModel> {
    return this.http
    .post<DeviceProfileModel>(`${this.env.apiUrl}${this.integrationUrl}/device-profile`, model)
    .pipe(catchError(this.handleError));

  }
  updateDeviceProfile(model: DeviceProfileModel): Observable<DeviceProfileModel> {
    return this.http
    .put<DeviceProfileModel>(`${this.env.apiUrl}${this.integrationUrl}/device-profile/${model.id}`, model)
    .pipe(catchError(this.handleError));
  }

  deleteDeviceProfile(model: DeviceProfileModel): Observable<DeviceProfileModel> {
    return this.http
    .delete<DeviceProfileModel>(`${this.env.apiUrl}${this.integrationUrl}/device-profile/${model.id}`)
    .pipe(catchError(this.handleError));
  }

  syncDeviceProfiles(): Observable<DeviceProfileModel> {
    return this.http
    .get<DeviceProfileModel>(`${this.env.apiUrl}${this.integrationUrl}/device-profile/sync`)
    .pipe(catchError(this.handleError));
  }

  provisionGateway(id: number, name: string): Observable<any> {
    return this.http
      .put<any>(`${this.env.apiUrl}${this.integrationUrl}/provision-gateway/${id}/${name}`, '')
      .pipe(catchError(this.handleError));
  }

  getUnprovisionedDevices(params?: string): Observable<AbstractDatasourceModel<any>[]> {
    let url = `${this.env.apiUrl}${this.integrationUrl}/unprovisioned`;
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
    let url = `${this.env.apiUrl}${this.integrationUrl}/provisioned`;
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

  provisionDevice(xid: string, id: number): Observable<AbstractDatasourceModel<any>> {
    return this.http
      .put<AbstractDatasourceModel<any>>(`${this.env.apiUrl}${this.integrationUrl}/provision/${xid}/${id}`, '')
      .pipe(map(result => new AbstractDatasourceModel<any>(result)));
  }

  deleteProvisionedDevice(id: any): Observable<AbstractDatasourceModel<any>> {
    return this.http
      .delete<AbstractDatasourceModel<any>>(`${this.env.apiUrl}${this.integrationUrl}/provisioned/${id}`)
      .pipe(map(result => new AbstractDatasourceModel<any>(result)));
  }

  deleteDevices(id: any): Observable<any>{
    return this.http.delete<any>(`${this.env.apiUrl}${this.integrationUrl}/device-types/${id}`)
      .pipe(map(result => <any>(result)));
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
