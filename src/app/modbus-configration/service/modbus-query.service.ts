import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EnvService} from "../../core/services";
import {Observable} from "rxjs";
import {ArrayWithTotalModel} from "../../core/models";
import {catchError, map} from "rxjs/operators";
import {ModbusQueryModel} from "../models";
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModbusQueryService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  private modbusQueryBaseUrl = '/v2/modbus/queries';
  private _total!: number;

  get total(): number {
    return this._total;
  }

  private static handleError<T>(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError('Some internal issue with making API Call ' + errorMessage);
  }

  public get(params?: any): Observable<ModbusQueryModel[]> {
    let url = `${this.env.apiUrl}${this.modbusQueryBaseUrl}`;
    if (params) {
      url = url + `?${params}`;
    }

    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i) => new ModbusQueryModel(i));
    }));
  }


  getModbusLists(Limit: number, offSet: number): Observable<ModbusQueryModel[]> {
    const url = `${this.env.apiUrl + this.modbusQueryBaseUrl}?limit(${Limit},${offSet})`;
    return this.http.get<ModbusQueryModel[]>(url);
  }

  public getById(id: number): Observable<ModbusQueryModel> {
    return this.http
    .get<ModbusQueryModel>(`${this.env.apiUrl}${this.modbusQueryBaseUrl}/${id}`)
    .pipe(map((result) => new ModbusQueryModel(result)));
  }

  public update(resource: Partial<ModbusQueryModel> & { toJson: () => ModbusQueryModel }): Observable<ModbusQueryModel> {
    return this.http
    .put<ModbusQueryModel>(`${this.env.apiUrl}${this.modbusQueryBaseUrl}/${resource.id}`, resource.toJson())
    .pipe(map((result) => new ModbusQueryModel(result)), catchError(ModbusQueryService.handleError));
  }

  public save(resource: Partial<ModbusQueryModel> & { toJson: () => ModbusQueryModel }): Observable<ModbusQueryModel> {
    return this.http
    .post<ModbusQueryModel>(`${this.env.apiUrl}${this.modbusQueryBaseUrl}`, resource.toJson())
    .pipe(map((result) => new ModbusQueryModel(result)), catchError(ModbusQueryService.handleError));
  }

  public delete(id: number): Observable<ModbusQueryModel> {
    return this.http
    .delete<ModbusQueryModel>(`${this.env.apiUrl}${this.modbusQueryBaseUrl}/${id}`)
    .pipe(map((result) => new ModbusQueryModel(result)));
  }

  public copy(id: number, params?: string): Observable<ModbusQueryModel> {
    let url = `${this.env.apiUrl}${this.modbusQueryBaseUrl}/copy/${id}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.put<ModbusQueryModel>(url, '');
  }

  public getDeviceTypes(): Observable<Map<string, string>> {
    return this.http.get<Map<string, string>>(`${this.env.apiUrl}${this.modbusQueryBaseUrl}/device-types`);
  }

  public getDeviceTypeAttributes(deviceType: string): Observable<Map<string, string>> {
    return this.http.get<Map<string, string>>(`${this.env.apiUrl}${this.modbusQueryBaseUrl}/device-types/attribute/${deviceType}`);
  }
}
