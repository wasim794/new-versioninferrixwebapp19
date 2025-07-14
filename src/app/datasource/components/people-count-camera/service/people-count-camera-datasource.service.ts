import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {PeopleCountCameraDatasourceModel} from '../../people-count-camera';

import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class PeopleCountCameraDatasourceService extends AbstractDataSourceService<PeopleCountCameraDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, PeopleCountCameraDatasourceModel, env);
  }
}
