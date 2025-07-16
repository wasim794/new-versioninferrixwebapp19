import {AbstractPublisherService, EnvService} from "../../../../core/services";
import {IntegrationSenderModel} from "../model/integration-sender.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IntegrationPointModel} from "../model/integration-point.model";

@Injectable({providedIn: 'root'})
export class IntegrationSenderService extends AbstractPublisherService<IntegrationSenderModel> {

  private _integrationPointModel!: IntegrationPointModel[];
  constructor(http: HttpClient, env: EnvService) {
    super(http, IntegrationSenderModel, env);
  }

  get integrationPointModel(): IntegrationPointModel[] {
    return this._integrationPointModel;
  }

  set integrationPointModel(value: IntegrationPointModel[]) {
    this._integrationPointModel = value;
  }
}
