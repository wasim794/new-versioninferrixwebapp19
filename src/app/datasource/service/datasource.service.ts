import {Injectable} from '@angular/core';
import {DatasourceModel} from '../model';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {DataPointModel} from '../model';
import {SetValueModel} from '../model/setValueModel';
import {EnvService} from '../../core/services';

@Injectable()
export class DatasourceService {
  private dataSourceUrl = '/v2/data-source';
  private dataPointUrl = '/v2/data-point';
  private status = '/enable-disable';
  private exportCode = '/v2/export-code/sensors';
  private dataPointUrlSet = '/v2/point-value';
  // @ts-ignore
  subject = new Subject<any>();
  public data!: String;
  objectTypeUrl = '/v2/bacnet/object-types';
  objectPropertiesUrl = '/v2/bacnet/object-properties';

  constructor(
    private http: HttpClient,
    private env: EnvService) {
  }


  getDataSourcePointsbyLimit(datasourceId: number, limit: any, offset: any): Observable<DataPointModel[]> {
    const url = `${this.env.apiUrl + this.dataPointUrl}?and(eq(dataSourceId,${datasourceId}),limit(${limit},${offset}))`;
    return this.http.get<DataPointModel[]>(url);
  }



  getReloadedDatapoint(): Observable<any> {
    return this.subject.asObservable();
  }



  FilterDataPoint(inputSearch: string, dataSourceId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<DataPointModel[]>(`${this.env.apiUrl + this.dataPointUrl}?and(eq(dataSourceId,${dataSourceId}),or(like(name,*${inputSearch}*),like(readPermission,*${inputSearch}*),like(setPermission,*${inputSearch}*)))`)
      .pipe(catchError(this.handleError));
  }




  setDatapointStatus(dataPointXid: string, status: string) {
    return this.http.patch(`${this.env.apiUrl + this.dataPointUrl + this.status}/${dataPointXid}` + '?enabled=' + status, '');
  }



  // tslint:disable-next-line:no-shadowed-variable
  saveDatasource(datasource: DatasourceModel) {
    return this.http.post(this.env.apiUrl + this.dataSourceUrl, datasource);
  }


  // tslint:disable-next-line:no-shadowed-variable
  saveDatapoint(Datapoint: Object) {
    return this.http.post(this.env.apiUrl + this.dataPointUrl, Datapoint);
  }


  // tslint:disable-next-line:no-shadowed-variable
  updateDataPoint(DataPoint: DataPointModel) {
    const xid = DataPoint.xid;
    return this.http.put(`${this.env.apiUrl + this.dataPointUrl}/${xid}`, DataPoint);
  }




  // tslint:disable-next-line:no-shadowed-variable
  updatedataSource(Datasource: any) {
    const xid = Datasource.xid;
    return this.http.put(`${this.env.apiUrl + this.dataSourceUrl}/${xid}`, Datasource);
  }


  getDataSource(pointXid: string): Observable<any> {
    const url = `${this.env.apiUrl + this.dataSourceUrl}/${pointXid}`;
    return this.http.get<any>(url);
  }



  getDataPointDetails(pointXid: string): Observable<any> {
    const url = `${this.env.apiUrl + this.dataPointUrl}/${pointXid}`;
    return this.http.get<any>(url);
  }



  getDatapointsByTypeId(typeId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<DataPointModel[]>(this.env.apiUrl + this.dataPointUrl + '?eq(dataTypeId,' + typeId).pipe(catchError(this.handleError));
  }

  deleteDatapoint(dataPointXid: string) {
    return this.http.delete(`${this.env.apiUrl + this.dataPointUrl}/${dataPointXid}`);
  }

  sensorExportCode(sensorType: any) {
    return this.http.get(`${this.env.apiUrl + this.exportCode}/${sensorType}`);
  }

  getObjectTypes(): Observable<any>{
    const url = `${this.env.apiUrl + this.objectTypeUrl}`;
    return this.http.get(url);
  }



  /* Handle Error
   *@param Error of type HttpErrorResponse
   */
  // private handleError<T>(error: HttpErrorResponse) {
  //   let errorMessage = '';
  //   if (error.error instanceof ErrorEvent) {
  //     // client-side error
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   return throwError('Some internal issue with making API Call ' + errorMessage);
  // }

  private handleError<T>(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent ?
      `Error: ${error.error.message}` :
      `Error Code: ${error.status}\nMessage: ${error.message}`;
    return throwError(`Some internal issue with making API Call ${errorMessage}`);
  }


}
