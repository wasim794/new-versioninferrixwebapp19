import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {DidocardDatasourceModel} from "../models/didocard-datasource.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class DidocardDatasourceService extends AbstractDataSourceService<DidocardDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, DidocardDatasourceModel, env);
  }
}
