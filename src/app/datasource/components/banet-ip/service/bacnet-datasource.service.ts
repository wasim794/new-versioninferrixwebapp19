import {AbstractDataSourceService, EnvService} from '../../../../core/services';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MeshNodesDatasourceModel} from "../../../../core/models/dataSource";

@Injectable({ providedIn: 'root' })
export class BacnetDatasourceService extends AbstractDataSourceService<MeshNodesDatasourceModel> {
  objectTypeUrl = '/v2/bacnet/object-types';
  objectPropertiesUrl = '/v2/bacnet/object-properties';

  constructor(http: HttpClient, env: EnvService) {
    super(http, MeshNodesDatasourceModel, env);
  }

  getObjectTypeUrl(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}${this.objectTypeUrl}`)
      .pipe(map((result) => {return result}));
  }

  getObjectPropertiesUrl(objectType: any): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}${this.objectPropertiesUrl}/${objectType}`)
      .pipe(map((result) => {return result}));
  }

}
