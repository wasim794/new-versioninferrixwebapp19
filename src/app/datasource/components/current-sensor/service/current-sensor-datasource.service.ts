import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {CurrentSensorDatasourceModel} from '../../current-sensor';
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class CurrentSensorDatasourceService extends AbstractDataSourceService<CurrentSensorDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, CurrentSensorDatasourceModel, env);
  }
}
