import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {ModbusSerialNodeDatasourceModel} from "../model/modbus-serial-node-datasource.model";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ModbusSerialNodeDatasourceService extends AbstractDataSourceService<ModbusSerialNodeDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, ModbusSerialNodeDatasourceModel, env);
  }
}
