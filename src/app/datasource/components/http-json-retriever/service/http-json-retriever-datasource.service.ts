import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {HttpJsonRetrieverDatasourceModel} from "../../http-json-retriever";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class HttpJsonRetrieverDatasourceService extends AbstractDataSourceService<HttpJsonRetrieverDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, HttpJsonRetrieverDatasourceModel, env);
  }
}
