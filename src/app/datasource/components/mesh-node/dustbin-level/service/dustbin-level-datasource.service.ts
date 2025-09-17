import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {DustbinLevelDatasourceModel} from "../models/dustbin-level-datasource.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class DustbinLevelDatasourceService extends AbstractDataSourceService<DustbinLevelDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, DustbinLevelDatasourceModel, env);
  }
}
