import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Alert} from '../model/alert';
import {EnvService} from '../../core/services';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertURL = '/v2/alert-list';
  alertAfterSave = new Subject<any>();
  alertAfterUpdate = new Subject<any>();

  constructor(private http: HttpClient, private env: EnvService) {
  }

  filterAlertList(inputSearch: any): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.env.apiUrl + this.alertURL}?like(name,*${inputSearch}*)`);
  }

  getAlertList(alertListLimit: number, offSet: number): Observable<Alert[]> {
    const url = `${this.env.apiUrl + this.alertURL}?limit(${alertListLimit},${offSet})`;
    return this.http.get<Alert[]>(url);
  }

  getAlertDetailByXid(alertXid: string): Observable<Alert> {
    const url = `${this.env.apiUrl + this.alertURL}/${alertXid}`;
    return this.http.get<Alert>(url);
  }


  saveAlert(alertList: object) {
    return this.http.post(`${this.env.apiUrl + this.alertURL}`, alertList);
  }

  deleteAlert(xid: string) {
    return this.http.delete(`${this.env.apiUrl + this.alertURL}/${xid}`);
  }

  updateAlert(alertList: any) {
    const xid = alertList.xid;
    return this.http.put(`${this.env.apiUrl + this.alertURL}/${xid}`, alertList);
  }

  setAfterAlertSave(alert: Alert) {
    this.alertAfterSave.next({data: alert});
  }

  getAfterAlertSave() {
    return this.alertAfterSave.asObservable();
  }

  setAfterAlertUpdate(alert: Alert) {
    this.alertAfterUpdate.next({data: alert});
  }

  getAfterAlertUpdate() {
    return this.alertAfterUpdate.asObservable();
  }
}
