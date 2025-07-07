import {AbstractDataSourceService, EnvService} from '../../../../core/services';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {MqttDataSourceModel} from "../../../model";
import {MqttDataSourceModel} from '../../mqtt-datasource';

@Injectable({ providedIn: 'root' })
export class mqttDataSourceService extends AbstractDataSourceService<MqttDataSourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, MqttDataSourceModel, env);
  }
}
