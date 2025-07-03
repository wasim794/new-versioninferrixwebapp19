import {Injectable} from "@angular/core";
import {
  BaseModbusConfigurationModel,
  ModbusNodeScanResultModel,
  ModbusReadRequestModel,
  ModbusReadResponseModel,
  ModbusWriteRequestModel,
  TypedModbusWriteRequestModel
} from "../models/dataSource";
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {EnvService} from "./env.service";
import {map} from "rxjs/operators";
import {TemporaryResourceModel} from "../models/temporaryResource";

@Injectable({
  providedIn: 'root'
})
export class ModbusToolService {

  private modbusToolUrl = '/v2/modbus';

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  public readModbusSerialData(model: ModbusReadRequestModel) : Observable<ModbusReadRequestModel>   {
    return this.http.post<ModbusReadRequestModel>(`${this.env.apiUrl}${this.modbusToolUrl}/serial/read`, model)
      .pipe(map((result) => new ModbusReadRequestModel(result)));
  }

  public readRawModbusSerialData(model: ModbusReadRequestModel) : Observable<ModbusReadResponseModel>   {
    return this.http.post<ModbusReadResponseModel>(`${this.env.apiUrl}${this.modbusToolUrl}/serial/read-raw`, model)
    .pipe(map((result) => new ModbusReadResponseModel(result)));
  }

  public writeModbusSerialData(model: TypedModbusWriteRequestModel) : Observable<number> {
    return this.http.post<number>(`${this.env.apiUrl}${this.modbusToolUrl}/serial/write`, model);
  }

  public writeRawModbusSerialData(model: ModbusWriteRequestModel) : Observable<number> {
    return this.http.post<number>(`${this.env.apiUrl}${this.modbusToolUrl}/serial/write-raw`, model);
  }

  public scan(model: BaseModbusConfigurationModel, expiry: number, timeout: number) : Observable<TemporaryResourceModel<ModbusNodeScanResultModel, any>> {
    return this.http.post<TemporaryResourceModel<ModbusNodeScanResultModel, any>>(`${this.env.apiUrl}${this.modbusToolUrl}/scan?expiry=${expiry}&timeout=${timeout}`, model)
    .pipe(map((result) => new TemporaryResourceModel<ModbusNodeScanResultModel, any>(result)));
  }

  public getScanStatus(id: string) : Observable<TemporaryResourceModel<ModbusNodeScanResultModel, any>> {
    return this.http.get<TemporaryResourceModel<ModbusNodeScanResultModel, any>>(`${this.env.apiUrl}${this.modbusToolUrl}/scan/${id}`)
    .pipe(map((result) => new TemporaryResourceModel<ModbusNodeScanResultModel, any>(result)));
  }

  public cancelScan(id: string) : Observable<TemporaryResourceModel<ModbusNodeScanResultModel, any>> {
    return this.http.put<TemporaryResourceModel<ModbusNodeScanResultModel, any>>(`${this.env.apiUrl}${this.modbusToolUrl}/scan/${id}`, '')
    .pipe(map((result) => new TemporaryResourceModel<ModbusNodeScanResultModel, any>(result)));
  }

  public removeScan(id: string) : Observable<TemporaryResourceModel<ModbusNodeScanResultModel, any>> {
    return this.http.delete<TemporaryResourceModel<ModbusNodeScanResultModel, any>>(`${this.env.apiUrl}${this.modbusToolUrl}/scan/${id}`)
    .pipe(map((result) => new TemporaryResourceModel<ModbusNodeScanResultModel, any>(result)));
  }

  public readModbusIpData(model: ModbusReadRequestModel) : Observable<Map<string, string>> {
    return this.http.post<Map<string, string>>(`${this.env.apiUrl}${this.modbusToolUrl}/ip/read`, model)
    .pipe(map((result) => new Map<string, string>(result)));
  }

  public readRawModbusIpData(model: ModbusReadRequestModel) : Observable<ModbusReadResponseModel> {
    return this.http.post<ModbusReadResponseModel>(`${this.env.apiUrl}${this.modbusToolUrl}/ip/read-raw`, model)
    .pipe(map((result) => new ModbusReadResponseModel(result)));
  }

  public writeModbusIpData(model: TypedModbusWriteRequestModel) : Observable<number> {
    return this.http.post<number>(`${this.env.apiUrl}${this.modbusToolUrl}/ip/write`, model);
  }

  public writeRawModbusIpData(model: ModbusWriteRequestModel) : Observable<number> {
    return this.http.post<number>(`${this.env.apiUrl}${this.modbusToolUrl}/ip/write-raw`, model);
  }
}
