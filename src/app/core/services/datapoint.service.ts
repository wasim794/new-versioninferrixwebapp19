import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {EnvService} from './env.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {DataPointModel} from '../models/dataPoint';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {ArrayWithTotalModel} from '../models';

@Injectable({ providedIn: 'root' })
export class DataPointService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private dataPointUrl = '/v2/data-point';
  private dataPointEnableDisableUrl = '/enable-disable';
  private dataPointExportCode = '/v2/export-code/sensors';
  private bulkReadPermission = '/bulk-read-permission';
  private bulkSetPermission = '/bulk-set-permission';
  private bulkSetEditPermission = '/bulk-permission';
  private _total!: number;

  get total(): number {
    return this._total;
  }

  private static handleError<T>(error: HttpErrorResponse) {
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

  public get(params?: any): Observable<DataPointModel[]> {
    let url = `${this.env.apiUrl}${this.dataPointUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i) => new DataPointModel(i));
    }));
  }

  public getByXid(xid: String): Observable<DataPointModel> {
    return this.http
    .get<DataPointModel>(`${this.env.apiUrl}${this.dataPointUrl}/${xid}`)
    .pipe(map((result) => new DataPointModel(result)));
  }

  public update(resource: Partial<DataPointModel> & { toJson: () => DataPointModel }): Observable<DataPointModel> {
    return this.http
    .put<DataPointModel>(`${this.env.apiUrl}${this.dataPointUrl}/${resource.xid}`, resource.toJson())
    .pipe(map((result) => new DataPointModel(result)), catchError(DataPointService.handleError));
  }

  public create(resource: Partial<DataPointModel> & { toJson: () => DataPointModel }): Observable<DataPointModel> {
    return this.http
    .post<DataPointModel>(`${this.env.apiUrl}${this.dataPointUrl}`, resource.toJson())
    .pipe(map((result) => new DataPointModel(result)), catchError(DataPointService.handleError));
  }

  public delete(xid: string): Observable<DataPointModel> {
    return this.http
    .delete<DataPointModel>(`${this.env.apiUrl}${this.dataPointUrl}/${xid}`)
    .pipe(map((result) => new DataPointModel(result)));
  }

  public enableDisable(xid: string, params: string): Observable<void> {
    let url = `${this.env.apiUrl + this.dataPointUrl}${this.dataPointEnableDisableUrl}/${xid}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .patch<void>(url, '');
  }

    getDataPointFromRQL(dataPointLimit: number, offset: number): Observable<DataPointModel[]> {
      return this.http.get<DataPointModel[]>( `${this.env.apiUrl + this.dataPointUrl}?and(limit(${dataPointLimit},${offset})`);

    }

  getSensorExportCode(sensorType: any) {
    return this.http.get(`${this.env.apiUrl + this.dataPointExportCode}/${sensorType}`);
  }

  dataPointProperties(dataPointXid: any, partialData: any) {
    return this.http.patch(`${this.env.apiUrl + this.dataPointUrl}/${dataPointXid}`, partialData);
  }

  bulkReadPermissionUpdate(dataPointObject: any) {
    const url = `${this.env.apiUrl + this.dataPointUrl}${this.bulkReadPermission}`;
    return this.http.patch(url, dataPointObject);
  }
  bulkSetPermissionUpdate(dataPointObject: any) {
    const url = `${this.env.apiUrl + this.dataPointUrl}${this.bulkSetPermission}`;
    return this.http.patch(url, dataPointObject);
  }
  bulkSetEditPermissionDataPoints(datasourceObject: any) {
    const url = `${this.env.apiUrl + this.bulkSetEditPermission}`;
    return this.http.patch(url, datasourceObject);
  }

BulkSetPermissionUpdateDataPoints(dataPointObject: any) {
    const url = `${this.env.apiUrl + this.bulkSetPermission}`;
    return this.http.patch(url, dataPointObject);
  }

}
