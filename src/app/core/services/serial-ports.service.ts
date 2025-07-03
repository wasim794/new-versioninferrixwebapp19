import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SerialPortsService {

  private getSerialPortsUrl = '/v2/utilities/gw/serial-ports';

  constructor(
    private api: ApiService
  ) {}

  getSerialPorts(): Observable<any> {
    return this.api.get(`${this.getSerialPortsUrl}`);
  }
}
