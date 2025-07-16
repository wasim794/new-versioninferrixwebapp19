import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DataPoint} from '../model/dataPoint';
import {DataPointDetail} from '../model/dataPointDetail';
import {EnvService} from '../../core/services';
@Injectable()
export class DatapointService {
  private url_dataPoint = '/v2/data-point';
  private url_getDataPointDetail = '/v2/point-value/latest';

  constructor(
    private http: HttpClient,
    private env: EnvService) {
  }


  getDataPointList(): Observable<DataPoint[]> {
    return this.http.get<DataPoint[]>(this.env.apiUrl + this.url_dataPoint);
  }


  getDataPointDetail(dataPointXid: string): Observable<DataPointDetail[]> {
    const url = `${this.env.apiUrl + this.url_getDataPointDetail}/${dataPointXid}`;
    return this.http.get<DataPointDetail[]>(url);
  }

}
