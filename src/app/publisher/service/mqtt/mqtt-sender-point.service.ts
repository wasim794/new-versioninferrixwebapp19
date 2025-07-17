import {AbstractPublishedPointService, EnvService} from "../../../core/services";
import {MqttSenderPointModel} from "../../components/mqtt/model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MqttSenderPointService extends AbstractPublishedPointService<MqttSenderPointModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, MqttSenderPointModel, env);
  }
}
