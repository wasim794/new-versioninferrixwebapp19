import {AbstractDataSourceService, EnvService} from "../../../core/services";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ThermostatDatasourceModel} from "../../../datasource/components/thermostat";
import {Observable} from "rxjs";
import {ArrayWithTotalModel} from "../../../core/models";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ThermostatService extends AbstractDataSourceService<ThermostatDatasourceModel> {
  private _total: number = 0;
  private thermostatUrl = "/v2/thermostat";

  constructor(http: HttpClient, env: EnvService) {
    super(http, ThermostatDatasourceModel, env);
  }

  get total(): number {
    return this._total;
  }

  getThermostatMeshOn(params?: string): Observable<ThermostatDatasourceModel[]> {
    const url = `${this.env.apiUrl}${this.dataSourceUrl}${params ? '?' + params : ''}`;
    return this.http.get<ArrayWithTotalModel<ThermostatDatasourceModel>>(url).pipe(
      map((result) => {
        this._total = result.total;
        return result.items.map((node) => new ThermostatDatasourceModel(node));
      })
    );
  }

  powerOnOff(xid: string, power: boolean): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/powerOnOff/${xid}/${power}`, '').pipe();
  }

  lockUnlock(xid: string, lock: boolean): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/lockUnlock/${xid}/${lock}`, '').pipe();
  }

  modeCommand(xid: string, mode: string): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/mode/${xid}/${mode}`, '').pipe();
  }

  fanCommand(xid: string, fan: string): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/fan/${xid}/${fan}`, '').pipe();
  }

  energySaving(xid: string, energy: boolean): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/energy-saving/${xid}/${energy}`, '').pipe();
  }

  automaticManual(xid: string, automatic: boolean): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/automatic/${xid}/${automatic}`, '').pipe();
  }

  targetTemperature(xid: string, temperature: number): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/target-temperature/${xid}/${temperature}`, '').pipe();
  }

  ecoModeTargetTemperature(xid: string, temperature: number): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/eco-target-temperature/${xid}/${temperature}`, '').pipe();
  }

  syncThermostat(xid: string, address: number): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.thermostatUrl}/sync/${xid}/${address}`, '').pipe();
  }
}
