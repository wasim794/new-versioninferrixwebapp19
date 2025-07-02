import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {MetaDatasourceModel} from "../../meta-data-source";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class MetaDatasourceService extends AbstractDataSourceService<MetaDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, MetaDatasourceModel, env);
  }

  private metaDatasourceUrl = '/v2/meta-data-source';

  public getLogFilePath(xid: string): Observable<string> {
    return this.http.get<string>(`${this.env.apiUrl}${this.metaDatasourceUrl}/log-file-path/${xid}`);
  }
}
