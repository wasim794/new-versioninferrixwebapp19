import {AbstractPublisherService, EnvService} from '../../../../core/services';
import {HttpSenderModel} from '../model';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpSenderPointModel} from '../model';

@Injectable({providedIn: 'root'})
export class HttpSenderService extends AbstractPublisherService<HttpSenderModel> {

  private _httpSenderPointModel!: HttpSenderPointModel[];

  constructor(http: HttpClient, env: EnvService) {
    super(http, HttpSenderModel, env);
  }

  get httpSenderPointModel(): HttpSenderPointModel[] {
    return this._httpSenderPointModel;
  }

  set httpSenderPointModel(value: HttpSenderPointModel[]) {
    this._httpSenderPointModel = value;
  }
}
