import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {PingDatasourceModel} from "../models/ping-datasource.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PingDatasourceService extends AbstractDataSourceService<PingDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, PingDatasourceModel, env);
  }
}
