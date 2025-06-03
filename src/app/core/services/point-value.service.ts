import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EnvService} from "./env.service";
import {PointValueTimeModel, SetValueModel} from "../models/pointValue";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PointValueService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  private pointValueUrl = '/v2/point-value';
  private pointValueLatestUrl = '/v2/point-value/latest';
  private pointValueBetweenUrl = '/v2/point-value/between';

  getLatestValue(xid: string, limit?: number): Observable<Array<PointValueTimeModel>> {
    let url = `${this.env.apiUrl}${this.pointValueLatestUrl}/${xid}`;
    if (limit) {
      url = url + `?limit=${limit}`;
    }
    return this.http.get<Array<PointValueTimeModel>>(url).pipe(map((results) =>
      results.map(value => new PointValueTimeModel(value))));
  }

  getBetweenValue(xid: string, from: number, to: number): Observable<Array<PointValueTimeModel>> {
    let url = `${this.env.apiUrl}${this.pointValueBetweenUrl}/${xid}`;
    url = url + `?from=${from}&to=${to}`
    return this.http.get<Array<PointValueTimeModel>>(url).pipe(map((results) =>
      results.map(value => new PointValueTimeModel(value))));
  }

  setPointValue(xid: string, value: SetValueModel): Observable<PointValueTimeModel> {
    return this.http
    .put<PointValueTimeModel>(`${this.env.apiUrl}${this.pointValueUrl}/${xid}`, value)
    .pipe(map((result) => new PointValueTimeModel(result)));
  }
}
