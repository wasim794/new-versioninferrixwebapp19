import {Observable, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {EnvService} from './env.service';
import {Injectable} from '@angular/core';
import {AbstractDatasourceModel} from '../models/dataSource';
import {ArrayWithTotalModel} from "../models";
import {DatasourceModel} from "../../datasource/model/datasourceModel";

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
  ) {
  }

  private dataSourceUrl = '/v2/data-source';
  private dataSourceCopyUrl = '/v2/data-source/copy';
  private dataSourceEnableDisableUrl = '/v2/data-source/enable-disable';
  private dataSourceTypes = '/v2/data-source-types';
  private _total!: number;
  subject = new Subject<any>();

  get total(): number {
    return this._total;
  }

  public get(params?: string): Observable<AbstractDatasourceModel<any>[]> {
    let url = `${this.env.apiUrl}${this.dataSourceUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i: any) => new AbstractDatasourceModel(i));
    }));
  }

  public copy(xid: string, params?: string): Observable<AbstractDatasourceModel<any>> {
    let url = `${this.env.apiUrl}${this.dataSourceCopyUrl}/${xid}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.put<AbstractDatasourceModel<any>>(url, '');
  }
  public delete(xid: string): Observable<any> {
    return this.http
      .delete<any>(`${this.env.apiUrl}${this.dataSourceUrl}/${xid}`);
  }
  public dataSourceType(): Observable<DatasourceModel[]> {
    return this.http.get<any[]>(this.env.apiUrl + this.dataSourceTypes);
  }

  public enableDisable(xid: string, params: boolean): Observable<AbstractDatasourceModel<any>> {
    let url = `${this.env.apiUrl}${this.dataSourceEnableDisableUrl}/${xid}?enabled=`+ params;
    return this.http.patch<AbstractDatasourceModel<any>>(url, '');
  }


}
