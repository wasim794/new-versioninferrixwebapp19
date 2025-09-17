import {PoeLightingDatasourceModel} from "../models/poe-lighting-datasource.model";
import {HttpClient} from "@angular/common/http";
import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PoeLightingDatasourceService extends AbstractDataSourceService<PoeLightingDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, PoeLightingDatasourceModel, env);
  }
}
