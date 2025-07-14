import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {retry, catchError, map, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {EventInstanceModel} from '../../event/model/eventInstanceModel';
import {EnvService} from '../../core/services/env.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private url = '/v1/event/pending-events';
  private url_AllEventListDp = '/v1/event/data-point';
  private ackEvent_url = '/v1/event/ack-event?id=';
  private url_search = '/v1/event/search?id=';
  private url_status = '&status=';
  private url_alarmLevel = '&alarmLevel=';
  private url_eventSourceType = '&eventSourceType=';
  private url_epochDateFromSelected = '&dateFrom=';
  private url_epochDateToSelected = '&dateTo=';
  private url_silenceEvent = '/v1/event/silence-event?id=';

  constructor(
    private http: HttpClient,
    private env: EnvService) {
  }

  /* Events list
   * @return an `Observable` of the body as an `Object` of Events
   */
  getEventsList(): Observable<EventInstanceModel[]> {
    return this.http.get<EventInstanceModel[]>(this.env.apiUrl + this.url)
      .pipe(catchError(this.handleError));
  }

  /* Events list of particular Data point
   * @return an `Observable` of the body as an `Object` of Events
   */
  getEventListDataPoint(dpXid: string): Observable<EventInstanceModel[]> {
    const url = `${this.env.apiUrl + this.url_AllEventListDp}/${dpXid}`;
    return this.http.get<EventInstanceModel[]>(url)
      .pipe(catchError(this.handleError));
  }

  /* Acknowledge the Event
   * @param Event id
   */
  ackEvent(eventId: number) {
    return this.http.post(this.env.apiUrl + this.ackEvent_url + eventId, {})
      .pipe(catchError(this.handleError));
  }

  /* Silence the Event
   * @param Event id
   */
  silenceEvent(eventId: number) {
    return this.http.post(this.env.apiUrl + this.url_silenceEvent + eventId, {})
      .pipe(catchError(this.handleError));
  }

  /* Search the Event according to Event's Id, Event's Status, and Event's alarmLevelSelected
   * @param Event id, status, alarm level
   * @return an `Observable` of the body as an `Object` of Events
   */

  // tslint:disable-next-line:max-line-length
  searchEvent(eventId: number, status: string, alarmLevelSelected: any, eventSourceTypesSelected: any, epochDateFromSelected: number, epochDateToSelected: number) {
    // tslint:disable-next-line:max-line-length
    const url = `${this.env.apiUrl + this.url_search}${eventId}${this.url_status}${status}${this.url_alarmLevel}${alarmLevelSelected}${this.url_eventSourceType}${eventSourceTypesSelected}${this.url_epochDateFromSelected}${epochDateFromSelected}${this.url_epochDateToSelected}${epochDateToSelected}`;
    return this.http.get<EventInstanceModel[]>(url)
      .pipe(catchError(this.handleError));
  }

  /* Handle Error
   * @param Error of type HttpErrorResponse
   */
  private handleError<T>(error: HttpErrorResponse) {
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
