import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {VirtualNodeDatasourceModel} from "../model/virtual-node-datasource.model";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class VirtualNodeDatasourceService extends AbstractDataSourceService<VirtualNodeDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, VirtualNodeDatasourceModel, env);
  }
}
