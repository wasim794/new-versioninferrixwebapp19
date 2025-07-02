import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EnvService} from "./env.service";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {StackJavascriptModel, StackJavascriptResultModel} from "../models/scripts";

@Injectable({
  providedIn: 'root'
})
export class ScriptUtilsService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private scriptUtilsUrl = '/v2/script';





  public validate(resource: Partial<StackJavascriptModel> & { toJson: () => StackJavascriptModel }): Observable<StackJavascriptResultModel> {
    return this.http.post<StackJavascriptResultModel>(`${this.env.apiUrl}${this.scriptUtilsUrl}/validate`, resource)
    .pipe(map((result) => new StackJavascriptResultModel(result), catchError(ScriptUtilsService.handleError)));
  }

  public run(resource: Partial<StackJavascriptModel> & { toJson: () => StackJavascriptModel }): Observable<StackJavascriptResultModel> {
    return this.http.post<StackJavascriptResultModel>(`${this.env.apiUrl}${this.scriptUtilsUrl}/run`, resource.toJson())
    .pipe(map((result) => new StackJavascriptResultModel(result)));
  }




  private static handleError<T>(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      console.log(error);
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError('Some internal issue with making API Call ' + errorMessage);
  }


}


