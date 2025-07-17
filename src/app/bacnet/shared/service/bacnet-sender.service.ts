import {AbstractPublisherService, EnvService} from '../../../core/services';
import {Injectable} from '@angular/core';
// import {BacnetSenderModel, BacnetSenderPointModel} from '../model';
import {BacnetSenderModel, BacnetSenderPointModel} from '../../../bacnet';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class BacnetSenderService extends AbstractPublisherService<BacnetSenderModel> {

  private _bacnetSenderPointModel!: BacnetSenderPointModel[];

  constructor(http: HttpClient, env: EnvService) {
    super(http, BacnetSenderModel, env);
  }

  get bacnetSenderPointModel(): BacnetSenderPointModel[] {
    return this._bacnetSenderPointModel;
  }

  set bacnetSenderPointModel(value: BacnetSenderPointModel[]) {
    this._bacnetSenderPointModel = value;
  }
}
