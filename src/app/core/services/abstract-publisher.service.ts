// // import {AbstractPublisherModel} from '../models/publisher';
// import {HttpClient, HttpErrorResponse} from '@angular/common/http';
// import {EnvService} from './env.service';
// import {throwError} from 'rxjs';
// import {Observable} from 'rxjs';
// import {catchError, map} from 'rxjs/operators';
// import {ArrayWithTotalModel} from "../models";

// export abstract class AbstractPublisherService<T extends AbstractPublisherModel<T>> {
//   constructor(
//     private http: HttpClient,
//     private tConstructor: new (m: Partial<T>, ...args: unknown[]) => T,
//     private env: EnvService
//   ) {
//   }

//   private publisherUrl = '/v2/publisher';
//   private publisherEnableDisableUrl = '/v2/publisher/enable-disable';
//   private _total!: number;

//   get total(): number {
//     return this._total;
//   }

//   private static handleError<E>(error: HttpErrorResponse) {
//     let errorMessage = '';
//     if (error.error instanceof ErrorEvent) {
//       // client-side error
//       errorMessage = `Error: ${error.error.message}`;
//     } else {
//       // server-side error
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
//     return throwError('Some internal issue with making API Call ' + errorMessage);
//   }

//   public get(params?: string): Observable<AbstractPublisherModel<any>[]> {
//     let url = `${this.env.apiUrl}${this.publisherUrl}`;
//     if (params) {
//       url = url + `?${params}`;
//     }
//     return this.http
//     .get<ArrayWithTotalModel<any>>(url)
//     .pipe(map((result) => {
//       this._total = result.total;
//       return result.items.map((i) => new AbstractPublisherModel(i));
//     }));
//   }

//   public getByXid(xid: String): Observable<T> {
//     return this.http
//     .get<T>(`${this.env.apiUrl}${this.publisherUrl}/${xid}`)
//     .pipe(map((result) => new this.tConstructor(result)));
//   }

//   public update(resource: Partial<T> & { toJson: () => T }): Observable<T> {
//     return this.http
//     .put<T>(`${this.env.apiUrl}${this.publisherUrl}/${resource.xid}`, resource.toJson())
//     .pipe(map((result) => new this.tConstructor(result)));
//   }

//   public create(resource: Partial<T> & { toJson: () => T }): Observable<T> {
//     return this.http
//     .post<T>(`${this.env.apiUrl}${this.publisherUrl}`, resource.toJson())
//     .pipe(map((result) => new this.tConstructor(result)));
//   }

//   public enableDisable(xid: string, params?: string): Observable<void> {
//     let url = `${this.env.apiUrl}${this.publisherEnableDisableUrl}/${xid}`;
//     if (params) {
//       url = url + `?${params}`;
//     }
//     return this.http
//     .patch<void>(url, '').pipe(catchError(AbstractPublisherService.handleError));
//   }

//   public delete(xid: string): Observable<T> {
//     return this.http
//     .delete<T>(`${this.env.apiUrl}${this.publisherUrl}/${xid}`)
//     .pipe(map((result) => new this.tConstructor(result)));
//   }

//   public copy(xid: string, params?: any): Observable<T> {
//     let url = `${this.env.apiUrl}${this.publisherUrl}/copy/${xid}`;
//     if (params) {
//       url = url + `?${params}`;
//     }
//     return this.http.put<T>(url, '');
//   }
// }
