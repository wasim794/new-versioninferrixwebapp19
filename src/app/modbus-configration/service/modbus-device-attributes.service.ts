import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {EnvService} from "../../core/services";
import {throwError} from "rxjs";
import {Observable} from "rxjs";
import {ArrayWithTotalModel} from "../../core/models";
import {catchError, map} from "rxjs/operators";
import {ModbusDeviceAttributesModel} from "../models";

@Injectable({
  providedIn: 'root'
})
export class ModbusDeviceAttributesService {
  pointDetails: any;
  editPermission!: string;
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {}

  private modbusDeviceAttributeUrl = '/v2/modbus/device/attributes';
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

  public get(params?: any): Observable<ModbusDeviceAttributesModel[]> {
    let url = `${this.env.apiUrl}${this.modbusDeviceAttributeUrl}`;
    if (params) {
      url = url + `?${params}`;
    }

    return this.http
    .get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((i) => new ModbusDeviceAttributesModel(i));
    }));
  }

  public getById(id: number): Observable<any> {
    return this.http
    .get<ModbusDeviceAttributesModel>(`${this.env.apiUrl}${this.modbusDeviceAttributeUrl}/${id}`)}

  public update(resource: any): Observable<ModbusDeviceAttributesModel> {
    return this.http
    .put<ModbusDeviceAttributesModel>(`${this.env.apiUrl}${this.modbusDeviceAttributeUrl}/${resource.id}`, resource)
    .pipe(map((result) => new ModbusDeviceAttributesModel(result)), catchError(ModbusDeviceAttributesService.handleError));
  }

  public save(resource: Partial<ModbusDeviceAttributesModel> & { toJson: () => ModbusDeviceAttributesModel }): Observable<ModbusDeviceAttributesModel> {
    return this.http
    .post<ModbusDeviceAttributesModel>(`${this.env.apiUrl}${this.modbusDeviceAttributeUrl}`, resource.toJson())
    .pipe(map((result) => new ModbusDeviceAttributesModel(result)), catchError(error => {
      return throwError(error);
    }));
  }

  public delete(id: number): Observable<ModbusDeviceAttributesModel> {
    return this.http
    .delete<ModbusDeviceAttributesModel>(`${this.env.apiUrl}${this.modbusDeviceAttributeUrl}/${id}`)
    .pipe(map((result) => new ModbusDeviceAttributesModel(result)));
  }

  public copy(id: number, params?: string): Observable<ModbusDeviceAttributesModel> {
    let url = `${this.env.apiUrl}${this.modbusDeviceAttributeUrl}/copy/${id}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.put<ModbusDeviceAttributesModel>(url, '');
  }
}
