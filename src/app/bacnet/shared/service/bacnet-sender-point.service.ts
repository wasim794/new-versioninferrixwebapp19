import {AbstractPublishedPointService, EnvService} from "../../../core/services";
// import {BacnetSenderPointModel} from "../model";
import {BacnetSenderPointModel} from '../../../bacnet';
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class BacnetSenderPointService extends AbstractPublishedPointService<BacnetSenderPointModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, BacnetSenderPointModel, env);
  }
}
