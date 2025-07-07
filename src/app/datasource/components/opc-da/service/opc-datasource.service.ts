import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {OpcDatasourceModel} from "../model/opc-datasource.model";
import {HttpClient} from "@angular/common/http";
import {OpcListTagsRequestModel} from "../model/opc-list-tags-request.model";
import {Observable} from "rxjs";
import {OpcItemModel} from "../model/opc-item.model";
import {OpcListServersRequestModel} from "../model/opc-list-servers-request.model";
import {Injectable} from "@angular/core";


@Injectable({ providedIn: 'root' })
export class OpcDatasourceService extends AbstractDataSourceService<OpcDatasourceModel> {

  public opcToolUrl = '/v2/opc-da';
  constructor(http: HttpClient, env: EnvService) {
    super(http, OpcDatasourceModel, env);
  }

  public listTags(model: OpcListTagsRequestModel): Observable<OpcItemModel[]> {
    return this.http
    .post<OpcItemModel[]>(`${this.env.apiUrl}${this.opcToolUrl}/list-tags`, model);
  }

  public listServers(model: OpcListServersRequestModel): Observable<string[]> {
    return this.http
    .post<string[]>(`${this.env.apiUrl}${this.opcToolUrl}/list-servers`, model);
  }
}
