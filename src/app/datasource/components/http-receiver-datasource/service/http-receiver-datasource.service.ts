import {AbstractDataSourceService, EnvService} from '../../../../core/services';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpReceiverModel} from '../model/http-receiver.model';

@Injectable({ providedIn: 'root' })
export class HttpReceiverDatasourceService extends AbstractDataSourceService<HttpReceiverModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, HttpReceiverModel, env);
  }
}
