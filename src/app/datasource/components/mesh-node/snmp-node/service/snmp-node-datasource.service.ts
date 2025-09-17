import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {SnmpNodeDatasourceModel} from "../model/snmp-node-datasource.model";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class SnmpNodeDatasourceService extends AbstractDataSourceService<SnmpNodeDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, SnmpNodeDatasourceModel, env);
  }
}
