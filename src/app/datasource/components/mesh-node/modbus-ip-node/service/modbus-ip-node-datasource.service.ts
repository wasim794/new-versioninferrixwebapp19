import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {ModbusIpNodeDatasourceModel} from "../model/modbus-ip-node-datasource.model";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ModbusIpNodeDatasourceService extends AbstractDataSourceService<ModbusIpNodeDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, ModbusIpNodeDatasourceModel, env);
  }
}
