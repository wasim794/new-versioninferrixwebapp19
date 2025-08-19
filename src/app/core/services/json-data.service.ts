import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  private jsonDataUrl = '/v2/json-data';

  constructor(
    private apiService: ApiService
  ) {}

  getJsonData(filter: string): Observable<any> {
    return this.apiService.get(`${this.jsonDataUrl}?${filter}`);
  }

  saveJsonData(jsonData: Object): Observable<any> {
    return this.apiService.post(`${this.jsonDataUrl}`, jsonData);
  }

  updateJsonData(jsonData: Object, xid: string): Observable<any> {
    return this.apiService.put(`${this.jsonDataUrl}/${xid}`, jsonData);
  }

  deleteJsonData(xid: string): Observable<any> {
    return this.apiService.delete(`${this.jsonDataUrl}/${xid}`);
  }
}
