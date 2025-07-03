import {AbstractDataSourceService, EnvService} from '../../../../core/services';
import {ModbusSerialModel} from '../../modbus-serial';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ModbusDatasourceService extends AbstractDataSourceService<ModbusSerialModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, ModbusSerialModel, env);
  }
}
