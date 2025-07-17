import {AbstractPublishedPointService, EnvService} from "../../../../core/services";
import {HttpSenderPointModel} from "../model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
@Injectable({providedIn: 'root'})
export class HttpSenderPointService extends AbstractPublishedPointService<HttpSenderPointModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, HttpSenderPointModel, env);
  }
  private _httpSenderPointModel!: HttpSenderPointModel[];

  get httpSenderPointModel(): HttpSenderPointModel[] {
    return this._httpSenderPointModel;
  }
  set httpSenderPointModel(value: HttpSenderPointModel[]) {
    this._httpSenderPointModel = value;
  }
}
