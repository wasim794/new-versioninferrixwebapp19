import {Injectable} from '@angular/core';
import {NetworkInterfaceModel} from '../models/server';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EnvService} from './env.service';
import {map} from 'rxjs/operators';
import {StringStringPairModel} from "../models/pair";

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private nicUrl = '/v2/server/network-interfaces';
  private restartUrl = '/v2/server/restart';
  private languagesUrl = '/v2/server/languages';

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  getNetworkInterfaces(params?: string): Observable<NetworkInterfaceModel[]> {
    let url = `${this.env.apiUrl}${this.nicUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.get<NetworkInterfaceModel[]>(url)
    .pipe(map((results) => results.map((result) => new NetworkInterfaceModel(result))));
  }

  restartStack() {
    return this.http.put<any>(`${this.env.apiUrl}${this.restartUrl}`, '').pipe();
  }

  getLanguages(): Observable<StringStringPairModel[]> {
    return this.http
      .get<StringStringPairModel[]>(`${this.env.apiUrl}${this.languagesUrl}`)
      .pipe(map((results) => results.map((result) => new StringStringPairModel(result))))
  }
}
