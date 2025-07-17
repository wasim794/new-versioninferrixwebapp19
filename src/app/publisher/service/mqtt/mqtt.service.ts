import {Injectable} from '@angular/core';
import {MqttSenderModel} from '../../components/mqtt/model';
import {AbstractPublisherService, EnvService} from '../../../core/services';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MqttService extends AbstractPublisherService<MqttSenderModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, MqttSenderModel, env);
  }

}
