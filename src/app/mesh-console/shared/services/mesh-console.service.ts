import {EnvService} from '../../../core/services';
import {MeshControllerResponseModel, MeshDiagnosticModel, MeshNodeInfoModel} from '../models';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ArrayWithTotalModel} from "../../../core/models";
import {map} from "rxjs/operators";
import {NumericKeyStaticData} from "../../../common";
import {MeshStackStatusConfirmMessageModel} from "../models/mesh-stack-status-confirm-message.model";

@Injectable({
  providedIn: 'root'
})
export class MeshConsoleService {

  private diagnosticDataUrl = '/v2/mesh-console/diagnostics';
  private meshNodeUrl = '/v2/mesh-console/mesh-nodes';
  private rebootNodeUrl = '/v2/mesh-console/reboot-node';
  private meshControllerUrl = '/v2/mesh-console/mesh-controller';
  private remoteAPI = '/v2/mesh-console/remote-api';
  private _totalDiagnostics!: any;

  constructor(private http: HttpClient,
              private env: EnvService
  ) {}

  get totalDiagnostics() {
    return this._totalDiagnostics;
  }

  getMeshNodesData(params?: string): Observable<MeshNodeInfoModel[]> {
    let url = `${this.env.apiUrl}${this.meshNodeUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._totalDiagnostics = result.total;
      return result.items.map((node) => node);
    }));
  }

  setDiagnosticsInterval(interval: number): Observable<MeshStackStatusConfirmMessageModel>{
    return this.http.put<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.diagnosticDataUrl}/${interval}`, '')
    .pipe(map((result) => new MeshStackStatusConfirmMessageModel(result)));
  }

  getDiagnosticsInterval(): Observable<NumericKeyStaticData[]> {
    return this.http.get(`${this.env.apiUrl}${this.diagnosticDataUrl}/interval`)
    .pipe(map((result) => {
      const intervals: NumericKeyStaticData[] = [];
      Object.entries(result).forEach(([key, value]) => {
        intervals.push({key: Number(key), value: value})
      });
      return intervals;
    }));
  }

  rebootNode(address: number) {
    return this.http.put(`${this.env.apiUrl}${this.rebootNodeUrl}/${address}`, '').pipe();
  }

  startStopMeshControllerPublisher(address: number, start: boolean): Observable<MeshControllerResponseModel> {
    return this.http.put<MeshControllerResponseModel>(`${this.env.apiUrl}${this.meshControllerUrl}/publisher/${address}?start=${start}`, '')
      .pipe(map((result) => new MeshControllerResponseModel(result)));
  }

  enableDisableMeshControllerWifi(address: number, enable: boolean): Observable<MeshControllerResponseModel> {
    return this.http.put<MeshControllerResponseModel>(`${this.env.apiUrl}${this.meshControllerUrl}/wifi/${address}?enable=${enable}`, '')
    .pipe(map((result) => new MeshControllerResponseModel(result)));
  }

  updateNodeSettings(address: number, nodeAddress: number, networkAddress: string, channel: number) {
    let params = '';
    if (nodeAddress) {
      params = `nodeAddress=${nodeAddress}`;
    }

    if (networkAddress) {
      params = params ? params + `&network=${networkAddress}` : params + `network=${networkAddress}`;
    }

    if (channel) {
      params = params ? params + `&channel=${channel}` : params + `channel=${channel}`;
    }
    return this.http.put(`${this.env.apiUrl}${this.remoteAPI}/update/${address}?${params}`, '').pipe();
  }
}
