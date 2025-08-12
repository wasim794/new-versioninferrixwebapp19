import {Injectable} from '@angular/core';
import {VirtualSwitchControlModel, VirtualSwitchModel} from '../model';
import {EnvService} from '../../../core/services';
import {ArrayWithTotalModel} from '../../../core/models';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VirtualSwitchService {

  private virtualSwitchUrl = '/v2/light-commissioning/virtual-switch';
  private virtualSwitchControlUrl = '/v2/light-commissioning/virtual-switch/control';
  private _total: number;

  get total(): number {
    return this._total;
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  get(params?: string): Observable<VirtualSwitchModel[]> {
    return this.http
    .get<ArrayWithTotalModel<any>>(`${this.env.apiUrl}${this.virtualSwitchUrl}?${params}`)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items.map((model) => new VirtualSwitchModel(model));
    }));
  }

  save(model: Partial<VirtualSwitchModel> & { toJson: () => VirtualSwitchModel }): Observable<VirtualSwitchModel> {
    return this.http.post<VirtualSwitchModel>(`${this.env.apiUrl}${this.virtualSwitchUrl}`, model.toJson())
      .pipe(map(value => new VirtualSwitchModel(value)));
  }

  update(model: Partial<VirtualSwitchModel> & { toJson: () => VirtualSwitchModel }): Observable<VirtualSwitchModel> {
    return this.http.put<VirtualSwitchModel>(`${this.env.apiUrl}${this.virtualSwitchUrl}/${model.xid}`, model.toJson())
      .pipe(map(value => new VirtualSwitchModel(value)));
  }

  delete(xid: string): Observable<VirtualSwitchModel> {
    return this.http.delete<VirtualSwitchModel>(`${this.env.apiUrl}${this.virtualSwitchUrl}/${xid}`)
      .pipe(map(value => new VirtualSwitchModel(value)), catchError(VirtualSwitchService.handleError));
  }

  control(model: VirtualSwitchControlModel & { toJson: () => VirtualSwitchControlModel },
          xid: string): Observable<VirtualSwitchControlModel> {
    return this.http.post<VirtualSwitchControlModel>(`${this.env.apiUrl}${this.virtualSwitchControlUrl}/${xid}`, model.toJson())
      .pipe(map(value => new VirtualSwitchControlModel(value)));
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


}
