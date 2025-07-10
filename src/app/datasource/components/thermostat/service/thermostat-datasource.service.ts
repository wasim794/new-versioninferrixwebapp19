import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {ThermostatDatasourceModel} from "../models/thermostat-datasource.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ThermostatDatasourceService extends AbstractDataSourceService<ThermostatDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, ThermostatDatasourceModel, env);
  }
}
