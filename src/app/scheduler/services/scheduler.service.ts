import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {EnvService} from '../../core/services';
import {Observable} from 'rxjs';
import {ArrayWithTotalModel} from '../../core/models';
import {catchError, map} from 'rxjs/operators';
import {ScheduleModel} from '../model/schedule.model';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SchedulerService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private schedulerUrl = '/v2/schedules';
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

  public get(params?: string): Observable<ScheduleModel[]> {
    let url = `${this.env.apiUrl}${this.schedulerUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
      .get<ArrayWithTotalModel<any>>(url)
      .pipe(map((result) => {
        this._total = result.total;
        return result.items.map((i) => new ScheduleModel(i));
      }));
  }

  public getByXid(xid: String): Observable<ScheduleModel> {
    return this.http
      .get<ScheduleModel>(`${this.env.apiUrl}${this.schedulerUrl}/${xid}`)
      .pipe(map((result) => new ScheduleModel(result)));
  }

  public create(resource: Partial<ScheduleModel> & { toJson: () => ScheduleModel }): Observable<ScheduleModel> {
    return this.http
      .post<ScheduleModel>(`${this.env.apiUrl}${this.schedulerUrl}`, resource.toJson())
      .pipe(map((result) => new ScheduleModel(result)), catchError(SchedulerService.handleError));
  }

  public update(resource: Partial<ScheduleModel> & { toJson: () => ScheduleModel }): Observable<ScheduleModel> {
    return this.http
      .put<ScheduleModel>(`${this.env.apiUrl}${this.schedulerUrl}/${resource.xid}`, resource.toJson())
      .pipe(map((result) => new ScheduleModel(result)), catchError(SchedulerService.handleError));
  }

  public delete(xid: string): Observable<ScheduleModel> {
    return this.http
      .delete<ScheduleModel>(`${this.env.apiUrl}${this.schedulerUrl}/${xid}`)
      .pipe(map((result) => new ScheduleModel(result)));
  }

  public enableDisable(xid: string, params?: String): Observable<void> {
    let url = `${this.env.apiUrl}${this.schedulerUrl}/enable-disable/${xid}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
      .patch<void>(url, '');
  }
}
