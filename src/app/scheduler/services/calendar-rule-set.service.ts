import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {EnvService} from '../../core/services';
import {throwError} from 'rxjs';
import {Observable} from 'rxjs';
import {ArrayWithTotalModel} from '../../core/models';
import {catchError, map} from 'rxjs/operators';
import {CalendarRuleSetModel} from '../model/calendar-rule-set.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarRuleSetService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private calendarRuleSetUrl = '/v2/schedule-rule-sets';
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

  public get(params?: string): Observable<CalendarRuleSetModel[]> {
    let url = `${this.env.apiUrl}${this.calendarRuleSetUrl}`;
    //console.log(url);
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
      .get<ArrayWithTotalModel<any>>(url)
      .pipe(map((result) => {
        this._total = result.total;
        return result.items.map((i) => new CalendarRuleSetModel(i));
      }));
  }

  public getByXid(xid: String): Observable<CalendarRuleSetModel> {
    return this.http
      .get<CalendarRuleSetModel>(`${this.env.apiUrl}${this.calendarRuleSetUrl}/${xid}`)
      .pipe(map((result) => new CalendarRuleSetModel(result)));
  }

  public create(resource: Partial<CalendarRuleSetModel> & { toJson: () => CalendarRuleSetModel }): Observable<CalendarRuleSetModel> {
    return this.http
      .post<CalendarRuleSetModel>(`${this.env.apiUrl}${this.calendarRuleSetUrl}`, resource.toJson())
      .pipe(map((result) => new CalendarRuleSetModel(result)), catchError(CalendarRuleSetService.handleError));
  }

  public update(resource: Partial<CalendarRuleSetModel> & { toJson: () => CalendarRuleSetModel }): Observable<CalendarRuleSetModel> {
    return this.http
      .put<CalendarRuleSetModel>(`${this.env.apiUrl}${this.calendarRuleSetUrl}/${resource.xid}`, resource.toJson())
      .pipe(map((result) => new CalendarRuleSetModel(result)), catchError(CalendarRuleSetService.handleError));
  }

  public delete(xid: string): Observable<CalendarRuleSetModel> {
    return this.http
      .delete<CalendarRuleSetModel>(`${this.env.apiUrl}${this.calendarRuleSetUrl}/${xid}`)
      .pipe(map((result) => new CalendarRuleSetModel(result)));
  }
}
