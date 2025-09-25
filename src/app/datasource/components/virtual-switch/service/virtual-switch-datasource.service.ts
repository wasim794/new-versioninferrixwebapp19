import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {VirtualSwitchDatasourceModel} from "../models/virtual-switch-datasource.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {VirtualSwitchPointLocatorModel} from "../models/virtual-switch-point-locator.model";

@Injectable({providedIn: 'root'})
export class VirtualSwitchDatasourceService extends AbstractDataSourceService<VirtualSwitchDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, VirtualSwitchDatasourceModel, env);
  }
}
