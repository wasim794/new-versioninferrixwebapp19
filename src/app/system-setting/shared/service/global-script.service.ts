import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EnvService} from "../../../core/services";
import {throwError} from "rxjs";
import {Observable} from "rxjs";
import {DataPointModel} from "../../../core/models/dataPoint";
import {ArrayWithTotalModel} from "../../../core/models";
import {catchError, map} from "rxjs/operators";
import {GlobalScriptModel} from "../model";
import {StackJavascriptModel, StackJavascriptResultModel} from "../../../core/models/scripts";

@Injectable({
  providedIn: 'root'
})
export class GlobalScriptService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private globalScriptUrl = '/v2/global-scripts';
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

  public get(params?: any): Observable<GlobalScriptModel[]> {
    let url = `${this.env.apiUrl}${this.globalScriptUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i) => new GlobalScriptModel(i));
    }));
  }

  public getByXid(xid: String): Observable<GlobalScriptModel> {
    return this.http
    .get<GlobalScriptModel>(`${this.env.apiUrl}${this.globalScriptUrl}/${xid}`)
    .pipe(map((result) => new GlobalScriptModel(result)));
  }

  public update(resource: Partial<GlobalScriptModel> & { toJson: () => GlobalScriptModel }): Observable<GlobalScriptModel> {
    return this.http
    .put<GlobalScriptModel>(`${this.env.apiUrl}${this.globalScriptUrl}/${resource.xid}`, resource.toJson())
    .pipe(map((result) => new GlobalScriptModel(result)), catchError(GlobalScriptService.handleError));
  }

  public create(resource: Partial<GlobalScriptModel> & { toJson: () => GlobalScriptModel }): Observable<GlobalScriptModel> {
    return this.http
    .post<GlobalScriptModel>(`${this.env.apiUrl}${this.globalScriptUrl}`, resource.toJson())
    .pipe(map((result) => new GlobalScriptModel(result)), catchError(GlobalScriptService.handleError));
  }

  public delete(xid: string): Observable<GlobalScriptModel> {
    return this.http
    .delete<GlobalScriptModel>(`${this.env.apiUrl}${this.globalScriptUrl}/${xid}`)
    .pipe(map((result) => new GlobalScriptModel(result)));
  }

  public validateScript(resource: Partial<StackJavascriptModel> & { toJson: () => StackJavascriptModel }): Observable<StackJavascriptResultModel> {
    return this.http.post<StackJavascriptResultModel>(`${this.env.apiUrl}${this.globalScriptUrl}/validate-script`, resource.toJson())
    .pipe(map((result) => new StackJavascriptResultModel(result)));
  }

  public validate(resource: Partial<StackJavascriptModel> & { toJson: () => StackJavascriptModel }): Observable<void> {
    return this.http.post<void>(`${this.env.apiUrl}${this.globalScriptUrl}/validate`, resource.toJson());
  }
}
