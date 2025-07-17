import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DatapointService} from '../../datapoint/service/datapoint.service';
import {AbstractPublisherService, DataSourceService} from '../../core/services';
import {Publisher} from '../model/publisher';
import {EnvService} from '../../core/services';
import {HttpSenderModel} from "../components/http";

@Injectable({
  providedIn: 'root'
})
export class HttpSenderService extends AbstractPublisherService<HttpSenderModel> {
  constructor(
     http: HttpClient,
    // private datapointService: DatapointService,
    // private dataSourceService: DataSourceService,
     env: EnvService) {
    super(http, HttpSenderModel, env);
  }
}
