import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {EnvService} from "../../../core/services";
import {AbstractDatasourceModel} from "../../../core/models/dataSource";
import {ArrayWithTotalModel} from "../../../core/models";

@Injectable({
  providedIn: 'root'
})
export class MeshPublisherService {
  integrationUrl = '/v2/mesh-console/mesh-publisher';
  private _total: number;

  get total(): number {
    return this._total;
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  getUnprovisionedDevicesMeshOn(params?: any): Observable<AbstractDatasourceModel<any>[]> {
    let URL = `${this.env.apiUrl}${this.integrationUrl}/unprovisioned`;
    if (params) {
      URL = URL + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(URL)
    .pipe(map(result => {
      this._total = result.total;
      return result.items.map(data => new AbstractDatasourceModel(data));
    }));
  }

  getProvisionedDevicesMeshOn(params?: any): Observable<AbstractDatasourceModel<any>[]> {
    let URL = `${this.env.apiUrl}${this.integrationUrl}/provisioned`;
    if (params) {
      URL = URL + `?${params}`;
    }
    return this.http
    .get<ArrayWithTotalModel<any>>(URL)
    .pipe(map(result => {
      this._total = result.total;
      return result.items.map(data => new AbstractDatasourceModel(data));
    }));
  }

  provisionDevice(id: number): Observable<AbstractDatasourceModel<any>> {
    return this.http
    .put<AbstractDatasourceModel<any>>(`${this.env.apiUrl}${this.integrationUrl}/provision/${id}`, '')
    .pipe(map(result => new AbstractDatasourceModel<any>(result)));
  }

  deleteProvisionedDevice(id: any): Observable<AbstractDatasourceModel<any>> {
    return this.http
    .delete<AbstractDatasourceModel<any>>(`${this.env.apiUrl}${this.integrationUrl}/unprovision/${id}`)
    .pipe(map(result => new AbstractDatasourceModel<any>(result)));
  }
}
