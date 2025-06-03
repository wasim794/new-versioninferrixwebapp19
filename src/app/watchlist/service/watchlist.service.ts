import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {WatchList} from '../../watchlist';
// import {DataPointDetail} from '../../datapoint/model/dataPointDetail';
import {EnvService} from '../../core/services';

@Injectable()
export class WatchlistService {
  private url = '/v2/watch-list';
  private dataPointsUrl ='/v2/data-point';
  private urlAddDataPoints = '/v2/watch-list/add-data-points';
  private urlRemoveDataPoints = '/v2/watch-list/remove-data-points';
  private urlPermission = '/v1/common/groups';
  private watchListXid!: string;
  private urlGetDataPointDetail = '/v1/point-value/latest';
  dataSourceAdded  = [];
  dataSourceDataPointAdded = [];
  dataPointsAdded:any = [];
  private dataPointsSubject = new Subject<any>();
  private dataSourceSubject = new Subject<any>();

  constructor(private http: HttpClient, private env: EnvService) {
  }

  setWatchListDataPoints(selectedDataPoints: any[]) {
    this.dataPointsSubject.next(selectedDataPoints);
  }
  getWatchListDataPoints(): Observable<any> {
    return this.dataPointsSubject.asObservable();
  }

  // getLatestDatapointData(dataPointXid: string, dataPointsLimit: number) {
  //   const url = `${this.env.apiUrl + this.urlGetDataPointDetail}/${dataPointXid}?limit=${dataPointsLimit}`;
  //   return this.http.get<DataPointDetail[]>(url);
  // }
  /* watchlist list
   * @return an `Observable` of the body as an `Object` of WatchList
   */

  getWatchLists(watchListLimit: number, offSet: number): Observable<WatchList[]> {
    const url = `${this.env.apiUrl + this.url}?limit(${watchListLimit},${offSet})`;
    return this.http.get<WatchList[]>(url);
  }
  /* Add new watchlist
 * @param watchList object
 * @return an `Observable` of the body as an `Object`.
 */
  saveWatchList(watchList:any) {
    return this.http.post(`${this.env.apiUrl + this.url}`, watchList)
      .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  /* get all group list
   * @return an `Observable` of the body as an `Object` of any type
   */
  getPermission(): Observable<any> {
    return this.http.get<string>(this.env.apiUrl + this.urlPermission)
      .pipe(catchError(this.handleError));
  }
  getWatchListData(watchListXId: string): Observable<WatchList> {
    this.watchListXid = watchListXId;
    const url = `${this.env.apiUrl + this.url}/${watchListXId}`;
    return this.http.get<WatchList>(url);
  }
   getAllDatasPoints(xid: string): Observable<any> {
      const url = `${this.env.apiUrl + this.dataPointsUrl}/${xid}`;
      return this.http.get<any>(url);
    }
  /* Delete the watchlist
   * @param watchList xid
   * @return an `Observable` of the body as an `Object`.
   */
  deleteWatchList(watchListXid: string) {
    return this.http.delete(`${this.env.apiUrl + this.url}/${watchListXid}`);
  }

  addDatapoints(watchListXid: string, dataPoints: any): Observable<WatchList> {
    // @ts-ignore
    return this.http.put(`${this.env.apiUrl + this.urlAddDataPoints}/${watchListXid}`, dataPoints);
  }
  /* Update the watchlist
   * @param watchList object
   * @return an `Observable` of the body as an `Object`.
   */
  updateWatchlist(watchList: Object) {
    return this.http.put(`${this.env.apiUrl + this.url}/${this.watchListXid}`, watchList);
  }
  /* Delete the dataPoint
   * @param dataPoint xid
   * @return an `Observable` of the body as an `Object`.
   */
  deleteDataPoint(dataPoints: Object, watchListXid: string) {
    return this.http.put(`${this.env.apiUrl + this.urlRemoveDataPoints}/${watchListXid}`, dataPoints);
  }
  /*
   private handleError<T> (operation = 'operation', result?:T) {
   return (error:any):Observable<T> => {
   // TODO: send the error to remote logging infrastructure
   console.error(error); // log to console instead
   // TODO: better job of transforming error for user consumption

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
      console.log(errorMessage);
    }
    return throwError('Some internal issue with making API Call ' + errorMessage);
  }

// Set dataSource to HttpModule data
  setDataSourceAdded(data:any) {
    this.dataSourceAdded = data;
  }


  setDataPointsAdded(selectedDataPoints: any[]) {
    this.dataPointsAdded = selectedDataPoints ;
  }


  filterWatchList(inputSearch: any) {
    return this.http.get<WatchList[]>(`${this.env.apiUrl + this.url}?like(name,*${inputSearch}*)`);
  }
}

