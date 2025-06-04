import {AbstractDatasourceModel} from '../models/dataSource';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {EnvService} from './env.service';
// import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

export abstract class AbstractDataSourceService<T extends AbstractDatasourceModel<T>> {

  constructor(
    public http: HttpClient,
    private tConstructor: new (m: Partial<T>, ...args: unknown[]) => T,
    public env: EnvService
  ) {
  }

  private _dataSourceUrl = '/v2/data-source';
  private dataSourceEnableDisableUrl = '/v2/data-source/enable-disable';
  private exportCode = '/v2/export-code/sensors';

  protected static handleError<E>(error: HttpErrorResponse) {
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

  get dataSourceUrl(): string {
    return this._dataSourceUrl;
  }

  public getByXid(xid: String): Observable<T> {
    return this.http
    .get<T>(`${this.env.apiUrl}${this._dataSourceUrl}/${xid}`)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public update(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.http
    .put<T>(`${this.env.apiUrl}${this._dataSourceUrl}/${resource.xid}`, resource)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public create(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.http
    .post<T>(`${this.env.apiUrl}${this._dataSourceUrl}`, resource)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public delete(xid: string): Observable<T> {
    return this.http
    .delete<T>(`${this.env.apiUrl}${this._dataSourceUrl}/${xid}`)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public partial(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.http
    .patch<T>(`${this.env.apiUrl}${this._dataSourceUrl}/${resource.xid}`, resource.toJson())
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public enableDisable(xid: string, params: HttpParams): Observable<void> {
    return this.http
    .patch<void>(`${this.env.apiUrl}${this.dataSourceEnableDisableUrl}/${xid}`, params);
  }
  public sensorExportCode(sensorType: any) {
    return this.http.get(`${this.env.apiUrl + this.exportCode}/${sensorType}`);
  }
}
