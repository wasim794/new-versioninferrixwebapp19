import {AbstractDataSourceService, EnvService} from '../../../../core/services';
import {ModbusIpModel} from '../../modbus-ip';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ModbusDatasourceIpService extends AbstractDataSourceService<ModbusIpModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, ModbusIpModel, env);
  }
}
