import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../core/services";
import {HttpClient} from "@angular/common/http";
import {SlBusDatasourceModel} from "../model/sl-bus-datasource.model";

@Injectable({ providedIn: 'root' })
export class SlBusDatasourceService extends AbstractDataSourceService<SlBusDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, SlBusDatasourceModel, env);
  }
}
