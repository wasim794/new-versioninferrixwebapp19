import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {
  AbstractEventHandlerModel,
  EmailEventHandlerModel,
  ProcessEventHandlerModel,
  SetPointEventHandlerModel,
  SmsEventHandlerModel
} from '../models/events/handlers';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {EnvService} from './env.service';
import {catchError, map} from 'rxjs/operators';
import {TypesModel} from '../models/utils';
import {ArrayWithTotalModel} from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  private eventHandlerUrl = '/v2/event-handler';
  private eventHandlerTypesUrl = '/v2/event-handler-types';
  private _total!: number;

  get total(): number {
    return this._total;
  }

  private static handleError<E>(error: HttpErrorResponse) {
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

  private static createEventHandler(model: AbstractEventHandlerModel<any>): AbstractEventHandlerModel<any> {
    if (model.handlerType === 'EMAIL_HANDLER') {
      return new EmailEventHandlerModel(model);
    } else if (model.handlerType === 'PROCESS_HANDLER') {
      return new ProcessEventHandlerModel(model);
    } else if (model.handlerType === 'SET_POINT_HANDLER') {
      return new SetPointEventHandlerModel(model);
    } else {
      return new SmsEventHandlerModel(model);
    }
  }

  public get(params?: string): Observable<AbstractEventHandlerModel<any>[]> {
    return this.http
    .get<ArrayWithTotalModel<any>>(`${this.env.apiUrl}${this.eventHandlerUrl}?${params}`)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((eventHandler) => EventHandlerService.createEventHandler(eventHandler));
    }));
  }

  public getByXid(xid: String): Observable<AbstractEventHandlerModel<any>> {
    return this.http
    .get<AbstractEventHandlerModel<any>>(`${this.env.apiUrl}${this.eventHandlerUrl}/${xid}`)
    .pipe(map((result) => EventHandlerService.createEventHandler(result)));
  }

  public update(resource: Partial<AbstractEventHandlerModel<any>> &
    { toJson: () => AbstractEventHandlerModel<any> }): Observable<AbstractEventHandlerModel<any>> {
    return this.http
    .put<AbstractEventHandlerModel<any>>(`${this.env.apiUrl}${this.eventHandlerUrl}/${resource.xid}`, resource.toJson())
    .pipe(map((result) => EventHandlerService.createEventHandler(result)), catchError(EventHandlerService.handleError));
  }

  public create(resource: Partial<AbstractEventHandlerModel<any>> &
    { toJson: () => AbstractEventHandlerModel<any> }): Observable<AbstractEventHandlerModel<any>> {
    return this.http
    .post<AbstractEventHandlerModel<any>>(`${this.env.apiUrl}${this.eventHandlerUrl}`, resource.toJson())
    .pipe(map((result) => EventHandlerService.createEventHandler(result)), catchError(EventHandlerService.handleError));
  }

  public delete(xid: string): Observable<AbstractEventHandlerModel<any>> {
    return this.http
    .delete<AbstractEventHandlerModel<any>>(`${this.env.apiUrl}${this.eventHandlerUrl}/${xid}`)
    .pipe(map((result) => EventHandlerService.createEventHandler(result)), catchError(EventHandlerService.handleError));
  }

  public getTypes(): Observable<TypesModel[]> {
    return this.http
    .get<ArrayWithTotalModel<any>>(`${this.env.apiUrl}${this.eventHandlerTypesUrl}`)
    .pipe(map((result) => result.items.map((item) => new TypesModel(item as TypesModel))));
  }
}
