import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvService} from './env.service';
import {UserCommentsModel} from '../models/comments';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ArrayWithTotalModel} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserCommentsService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private commentsUrl = '/v2/comments';
  private _total!: number;

  get total(): number {
    return this._total;
  }

  get(params?: string): Observable<UserCommentsModel[]> {
    let url = `${this.env.apiUrl}${this.commentsUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((comment) => new UserCommentsModel(comment));
    }));
  }

  getByXid(xid: string): Observable<UserCommentsModel> {
    return this.http.get<UserCommentsModel>(`${this.env.apiUrl}${this.commentsUrl}/${xid}`)
    .pipe(map((comment) => new UserCommentsModel(comment)));
  }

  save(comment: UserCommentsModel): Observable<UserCommentsModel> {
    return this.http.post<UserCommentsModel>(`${this.env.apiUrl}${this.commentsUrl}`, comment)
    .pipe(map((model) => new UserCommentsModel(model)));
  }

  update(xid: string, comment: UserCommentsModel): Observable<UserCommentsModel> {
    return this.http.put<UserCommentsModel>(`${this.env.apiUrl}${this.commentsUrl}/${xid}`, comment)
    .pipe(map((model) => new UserCommentsModel(model)));
  }

  delete(xid: string): Observable<UserCommentsModel> {
    return this.http.delete<UserCommentsModel>(`${this.env.apiUrl}${this.commentsUrl}/${xid}`)
    .pipe(map((comment) => new UserCommentsModel(comment)));
  }
}
