import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {PaperTowelLevelDatasourceModel} from "../models/paper-towel-level-datasource.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PaperTowelLevelDatasourceService extends AbstractDataSourceService<PaperTowelLevelDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, PaperTowelLevelDatasourceModel, env);
  }
}
