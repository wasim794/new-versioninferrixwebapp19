import {AbstractDataSourceService, EnvService} from '../../../../core/services';
import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DoorSensorDatasourceService extends AbstractDataSourceService<MeshNodesDatasourceModel> {
  constructor(http: HttpClient, env: EnvService) {
    super(http, MeshNodesDatasourceModel, env);
  }
}
