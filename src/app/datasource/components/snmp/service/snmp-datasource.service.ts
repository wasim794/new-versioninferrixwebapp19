import {AbstractDataSourceService, EnvService} from '../../../../core/services';
import { SnmpDatasourceModel} from '../../snmp';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnmpDatasourceService extends AbstractDataSourceService<SnmpDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, SnmpDatasourceModel, env);
  }
}
