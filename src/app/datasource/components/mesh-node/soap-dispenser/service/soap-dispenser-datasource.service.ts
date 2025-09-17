import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {SoapDispenserDatasourceModel} from "../models/soap-dispenser-datasource.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SoapDispenserDatasourceService extends AbstractDataSourceService<SoapDispenserDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, SoapDispenserDatasourceModel, env);
  }
}
