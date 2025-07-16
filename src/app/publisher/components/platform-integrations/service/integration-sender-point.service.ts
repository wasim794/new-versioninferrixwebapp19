import {AbstractPublishedPointService, EnvService} from "../../../../core/services";
import {IntegrationPointModel} from "../model/integration-point.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class IntegrationSenderPointService extends AbstractPublishedPointService<IntegrationPointModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, IntegrationPointModel, env);
  }
}
