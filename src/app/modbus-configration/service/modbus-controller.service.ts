import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EnvService} from "../../core/services";
import {Observable} from "rxjs/Observable";
import {ArrayWithTotalModel} from "../../core/models";
import {map} from "rxjs/operators";
import {CommandModel, ModbusControllerModel} from "../models";
import {ModbusControllerResponseModel} from "../models";

@Injectable({
  providedIn: 'root'
})
export class ModbusControllerService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  private modbusControllerBaseUrl = '/v2/modbus/controllers';
  private _total: number;

  get total(): number {
    return this._total;
  }

  public get(params?: any): Observable<ModbusControllerModel[]> {
    let url = `${this.env.apiUrl}${this.modbusControllerBaseUrl}`;
    if (params) {
      url = url + `?${params}`;
    }

    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i) => new ModbusControllerModel(i));
    }));
  }

  public getById(id: number): Observable<ModbusControllerModel> {
    return this.http
      .get<ModbusControllerModel>(`${this.env.apiUrl}${this.modbusControllerBaseUrl}/${id}`)
      .pipe(map((result) => new ModbusControllerModel(result)));
  }

  public sendModbusQuery(id: number, queryId: number, enabled?: boolean): Observable<ModbusControllerResponseModel> {
    let url = `${this.env.apiUrl}${this.modbusControllerBaseUrl}/query/${id}/${queryId}`;
    if (enabled)
      url = url + `?enabled=${enabled}`;
    return this.http
      .put<ModbusControllerResponseModel>(url, '')
      .pipe(map((result) => new ModbusControllerResponseModel(result)));
  }

  public sendModbusQueryIdList(id: number, queryIds: Array<number>, enabled?: boolean): Observable<ModbusControllerResponseModel> {
    let url = `${this.env.apiUrl}${this.modbusControllerBaseUrl}/query/${id}`;
    if (enabled)
      url = url + `?enabled=${enabled}`;
    return this.http
    .put<ModbusControllerResponseModel>(url, queryIds)
    .pipe(map((result) => new ModbusControllerResponseModel(result)));
  }

  public resetController(id: number): Observable<ModbusControllerResponseModel> {
    let url = `${this.env.apiUrl}${this.modbusControllerBaseUrl}/reset/${id}`;
    return this.http
    .delete<ModbusControllerResponseModel>(url)
    .pipe(map((result) => new ModbusControllerResponseModel(result)));
  }

  public stopPolling(id: number): Observable<any> {
    let url = `${this.env.apiUrl}${this.modbusControllerBaseUrl}/stop-polling/${id}`;
    return this.http.put(url, "").pipe();
  }

  public startPolling(id: number): Observable<any> {
    let url = `${this.env.apiUrl}${this.modbusControllerBaseUrl}/start-polling/${id}`;
    return this.http.put(url, "").pipe();
  }

  public configureModbusDataTransfer(id: number, model: CommandModel): Observable<any> {
    let url = `${this.env.apiUrl}${this.modbusControllerBaseUrl}/data-transfer/${id}`;
    return this.http.put(url, model.toJson()).pipe();
  }


}

