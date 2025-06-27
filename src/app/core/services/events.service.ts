import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from './env.service';
import {
  DataPointEventLevelSummaryModel,
  EventInstanceModel,
  EventLevelSummaryModel,
  EventQueryBySourceTypeFilter,
  PeriodCountsModel
} from '../models/events';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ArrayWithTotalModel} from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private eventsUrl = '/v2/events';
  private _total!: number;

  get total(): number {
    return this._total;
  }

  getActiveEvents(): Observable<EventInstanceModel[]> {
    return this.http.get<EventInstanceModel[]>(`${this.env.apiUrl}${this.eventsUrl}/active`)
    .pipe(map((events) => events.map((event) => new EventInstanceModel(event))));
  }

  getActiveEventSummary(): Observable<EventLevelSummaryModel[]> {
    return this.http.get<EventLevelSummaryModel[]>(`${this.env.apiUrl}${this.eventsUrl}/active-summary`)
    .pipe(map((events) => events.map((event) => new EventLevelSummaryModel(event))));
  }

  getUnacknowledgedEventSummary(): Observable<EventLevelSummaryModel[]> {
    return this.http.get<EventLevelSummaryModel[]>(`${this.env.apiUrl}${this.eventsUrl}/unacknowledged-summary`)
    .pipe(map((events) => events.map((event) => new EventLevelSummaryModel(event))));
  }

  getDataPointEventLevelSummary(xids: string[]): Observable<DataPointEventLevelSummaryModel[]> {
    return this.http.post<DataPointEventLevelSummaryModel[]>(`${this.env.apiUrl}${this.eventsUrl}/data-point-summaries`, xids)
    .pipe(map((events) => events.map((event) => new DataPointEventLevelSummaryModel(event))));
  }

  getById(id: number): Observable<EventInstanceModel> {
    return this.http.get<EventInstanceModel>(`${this.env.apiUrl}${this.eventsUrl}/${id}`)
    .pipe(map((event) => new EventInstanceModel(event)));
  }

  query(params?: string): Observable<EventInstanceModel[]> {
    let url = `${this.env.apiUrl}${this.eventsUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((event) => new EventInstanceModel(event));
    }));
  }

  acknowledgeById(id: number): Observable<EventInstanceModel> {
    return this.http.put<EventInstanceModel>(`${this.env.apiUrl}${this.eventsUrl}/acknowledge/${id}`, JSON.parse(JSON.stringify(null)))
    .pipe(map((event) => new EventInstanceModel(event)));
  }

  queryEventBySourceType(query: EventQueryBySourceTypeFilter): Observable<EventInstanceModel[]> {
    return this.http.post<EventInstanceModel[]>(`${this.env.apiUrl}${this.eventsUrl}/query/events-by-source-type`,
      JSON.parse(JSON.stringify(query)))
    .pipe(map((events) => events.map((event) => new EventInstanceModel(event))));
  }

  counts(dates: [], params?: string): Observable<PeriodCountsModel[]> {
    let url = `${this.env.apiUrl}${this.eventsUrl}/counts`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.post<PeriodCountsModel[]>(url, JSON.parse(JSON.stringify(dates)))
    .pipe(map((events) => events.map((event) => new PeriodCountsModel(event))));
  }
}
