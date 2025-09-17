import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {BacnetIpNodeDatasourceModel} from "../model/bacnet-ip-node-datasource.model";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class BacnetIpNodeDatasourceService extends AbstractDataSourceService<BacnetIpNodeDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, BacnetIpNodeDatasourceModel, env);
  }
}
