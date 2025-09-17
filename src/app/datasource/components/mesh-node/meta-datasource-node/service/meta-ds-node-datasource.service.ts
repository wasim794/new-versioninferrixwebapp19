import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {MetaDsNodeDatasourceModel} from "../model/meta-ds-node-datasource.model";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class MetaDsNodeDatasourceService extends AbstractDataSourceService<MetaDsNodeDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, MetaDsNodeDatasourceModel, env);
  }
}
