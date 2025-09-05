import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EnvService} from "../../core/services";
import {throwError} from "rxjs";
import {Observable} from "rxjs";
import {ArrayWithTotalModel} from "../../core/models";
import {catchError, map} from "rxjs/operators";
import {ModbusDeviceDetailsModel} from "../models";

class ModbusDevice {
  id!: string;

  toJson() {

  }
}

@Injectable({
  providedIn: 'root'
})
export class ModbusDeviceDetailService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  private modbusDeviceUrl = '/v2/modbus/device';
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

  public get(params?: any): Observable<ModbusDeviceDetailsModel[]> {
    let url = `${this.env.apiUrl}${this.modbusDeviceUrl}`;
    if (params) {
      url = url + `?${params}`;
    }

    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i) => new ModbusDeviceDetailsModel(i));
    }));
  }

  public getById(id: number): Observable<ModbusDeviceDetailsModel> {
    return this.http
    .get<ModbusDeviceDetailsModel>(`${this.env.apiUrl}${this.modbusDeviceUrl}/${id}`)
    .pipe(map((result) => new ModbusDeviceDetailsModel(result)));
  }

  public update(resource: ModbusDeviceDetailsModel): Observable<ModbusDeviceDetailsModel> {
    return this.http
    .put<ModbusDeviceDetailsModel>(`${this.env.apiUrl}${this.modbusDeviceUrl}/${resource.id}`, resource.toJson())
    .pipe(map((result) => new ModbusDeviceDetailsModel(result)), catchError(ModbusDeviceDetailService.handleError));
  }

  public save(resource: Partial<ModbusDeviceDetailsModel> & { toJson: () => ModbusDeviceDetailsModel }): Observable<ModbusDeviceDetailsModel> {
    return this.http
    .post<ModbusDeviceDetailsModel>(`${this.env.apiUrl}${this.modbusDeviceUrl}`, resource.toJson())
    .pipe(map((result) => new ModbusDeviceDetailsModel(result)),  catchError(error => {
      return throwError(error);
    }));
  }


  public delete(id: number): Observable<ModbusDeviceDetailsModel> {
    return this.http
    .delete<ModbusDeviceDetailsModel>(`${this.env.apiUrl}${this.modbusDeviceUrl}/${id}`)
    .pipe(map((result) => new ModbusDeviceDetailsModel(result)));
  }

  public copy(id: number, params?: string): Observable<ModbusDeviceDetailsModel> {
    let url = `${this.env.apiUrl}${this.modbusDeviceUrl}/copy/${id}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.put<ModbusDeviceDetailsModel>(url, '');
  }


}
