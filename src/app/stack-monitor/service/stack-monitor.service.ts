import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {StackMonitorData} from '../model';
import {EnvService} from '../../core/services';


@Injectable({
  providedIn: 'root'
})
export class StackMonitorService {

  constructor(
    private http: HttpClient,
    private env: EnvService) {
  }

  private url_stackMonitors = '/v2/stack-monitor';

  /* stack monitor detail
  * @param stack monitor id
  * @return an `Observable` of the body as an `Object` of stack monitor.
  */
  getStackMonitorById(stackMonitorId: string): Observable<StackMonitorData> {
    const url = `${this.env.apiUrl + this.url_stackMonitors}/${stackMonitorId}`;
    return this.http.get<StackMonitorData>(url);
  }

  /* stack monitor wireless detail
  * @param stack monitor id
  * @return an `Observable` of the body as an `Object` of stack monitor.
  */
  getStackWirelessQualityById(stackWirelessQualityId: string): Observable<StackMonitorData> {
    const url = `${this.env.apiUrl + this.url_stackMonitors}/${stackWirelessQualityId}`;
    return this.http.get<StackMonitorData>(url);
  }

  /* stack monitor processor detail
* @param stack monitor id
* @return an `Observable` of the body as an `Object` of stack monitor.
*/
  getStackProcessorUtilizationById(getstackProcesserUtilizationId: string): Observable<StackMonitorData> {
    const url = `${this.env.apiUrl + this.url_stackMonitors}/${getstackProcesserUtilizationId}`;
    return this.http.get<StackMonitorData>(url);
  }

  /* stack monitor memory detail
 * @param stack monitor id
 * @return an `Observable` of the body as an `Object` of stack monitor.
 */
  getStackMemoryById(stackMemoryId: string): Observable<StackMonitorData> {
    const url = `${this.env.apiUrl + this.url_stackMonitors}/${stackMemoryId}`;
    return this.http.get<StackMonitorData>(url);
  }

  /* stack monitor Database detail
* @param stack monitor id
* @return an `Observable` of the body as an `Object` of stack monitor.
*/
  getStackDataBaseById(stackDatabaseId: string): Observable<StackMonitorData> {
    const url = `${this.env.apiUrl + this.url_stackMonitors}/${stackDatabaseId}`;
    return this.http.get<StackMonitorData>(url);
  }

  /* stack monitor Thread detail
* @param stack monitor id
* @return an `Observable` of the body as an `Object` of stack monitor.
*/
  getStackThreadPriorityById(stackThreadPriorityId: string): Observable<StackMonitorData> {
    const url = `${this.env.apiUrl + this.url_stackMonitors}/${stackThreadPriorityId}`;
    return this.http.get<StackMonitorData>(url);
  }

  /* Handle Error
  *@param Error of type HttpErrorResponse
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
