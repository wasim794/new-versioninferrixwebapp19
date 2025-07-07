import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {ScriptingDatasourceModel} from "../models/scripting-datasource.model";
import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {StackJavascriptModel, StackJavascriptResultModel} from "../../../../core/models/scripts";
import {catchError, map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class ScriptingDatasourceService extends AbstractDataSourceService<ScriptingDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, ScriptingDatasourceModel, env);
  }

  private scriptDatasourceUrl = '/v2/script-data-source';

  public getLogFilePath(xid: string): Observable<string> {
    return this.http.get<string>(`${this.env.apiUrl}${this.scriptDatasourceUrl}/log-file-path/${xid}`);
  }

  public validateScript(xid: string, model: StackJavascriptModel): Observable<StackJavascriptResultModel> {
    return this.http.post<StackJavascriptResultModel>(`${this.env.apiUrl}${this.scriptDatasourceUrl}/validate-script/${xid}`, model)
      .pipe(map((result) => new StackJavascriptResultModel(result), catchError(ScriptingDatasourceService.handleError)));
  }

   handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      alert(`Client-side error: ${error.error.message}`);
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      alert(`Server-side error - Error Code: ${error.status}\nMessage: ${error.message}`);
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError('Some internal issue with making API Call ' + errorMessage);
  }



}
