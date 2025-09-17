import {Injectable} from "@angular/core";
import {AbstractDataSourceService, EnvService} from "../../../../../core/services";
import {BacnetSerialNodeDatasourceModel} from "../model/bacnet-serial-node-datasource.model";
import {HttpClient} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class BacnetSerialNodeDatasourceService extends AbstractDataSourceService<BacnetSerialNodeDatasourceModel> {

  constructor(http: HttpClient, env: EnvService) {
    super(http, BacnetSerialNodeDatasourceModel, env);
  }
}
