import {Observable} from 'rxjs';
import {ArrayWithTotalModel} from '../models';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {EnvService} from './env.service';
import {Injectable} from '@angular/core';
import {AbstractPublisherPointModel} from '../models/publisher';
import {throwError} from "rxjs";
// @Injectable({providedIn: 'root'})
export abstract class AbstractPublishedPointService<T extends AbstractPublisherPointModel<T>> {

  protected constructor(
    private http: HttpClient,
    private tConstructor: new (m: Partial<T>, ...args: unknown[]) => T,
    private env: EnvService
  ) {
  }

  private publishedPointUrl = '/v2/published-points';
  private publishedPointEnableDisableUrl = '/v2/published-points/enable-disable';
  private _total!: number;

  get total(): number {
    return this._total;
  }

  public get(params?: string): Observable<T[]> {
    let url = `${this.env.apiUrl}${this.publishedPointUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i) => new this.tConstructor(i));
    }));
  }

  public enableDisable(xid: string, params?: String): Observable<void> {
    let url = `${this.env.apiUrl}${this.publishedPointEnableDisableUrl}/${xid}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .put<void>(url, '').pipe(catchError(AbstractPublishedPointService.handleError));
  }

  public delete(xid: string): Observable<T> {
    return this.http
    .delete<T>(`${this.env.apiUrl}${this.publishedPointUrl}/${xid}`)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public getByXid(xid: String): Observable<T> {
    return this.http
    .get<T>(`${this.env.apiUrl}${this.publishedPointUrl}/${xid}`)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public update(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.http
    .put<T>(`${this.env.apiUrl}${this.publishedPointUrl}/${resource.xid}`, resource)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public create(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.http
    .post<T>(`${this.env.apiUrl}${this.publishedPointUrl}`, resource)
    .pipe(map((result) => new this.tConstructor(result)));
  }

  public partial(resource: Partial<T> & { toJson: () => T }): Observable<T> {
    return this.http
    .patch<T>(`${this.env.apiUrl}${this.publishedPointUrl}/${resource.xid}`, resource.toJson())
    .pipe(map((result) => new this.tConstructor(result)));
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
}
