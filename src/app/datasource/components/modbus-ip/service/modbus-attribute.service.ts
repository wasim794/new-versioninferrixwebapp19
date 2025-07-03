import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EnvService} from '../../../../core/services';

@Injectable({ providedIn: 'root' })
export class ModbusAttributeIpService {
  private commonUrl = '/v2/modbus/attributes/serial/';
  private range = '/v2/modbus/attributes/range';
  private modbusDataType = '/v2/modbus/attributes/data-type';
  private writeType = '/v2/modbus/attributes/write-type';
  private flowControl = this.commonUrl + 'flow-control';
  private dataBit = this.commonUrl + 'data-bits';
  private stopBit = this.commonUrl + 'stop-bits';
  private parity = this.commonUrl + 'parity';
  private encoding = this.commonUrl + 'encoding';
  private TransportType = '/v2/modbus/attributes/ip/transport-type';

  constructor(
    private http: HttpClient,
    private env: EnvService) {
  }

  getFlowControls(): Observable<any> {
    const url = `${this.env.apiUrl + this.flowControl}`;
    return this.http.get(url);
  }

  getRange(): Observable<any> {
    const url = `${this.env.apiUrl + this.range}`;
    return this.http.get(url);
  }

  getDataType(): Observable<any> {
    const url = `${this.env.apiUrl + this.modbusDataType}`;
    return this.http.get(url);
  }

  getWriteType(): Observable<any> {
    const url = `${this.env.apiUrl + this.writeType}`;
    return this.http.get(url);
  }

  getDataBit(): Observable<any> {
    const url = `${this.env.apiUrl + this.dataBit}`;
    return this.http.get(url);
  }

  getStopBit(): Observable<any> {
    const url = `${this.env.apiUrl + this.stopBit}`;
    return this.http.get(url);
  }

  getParity(): Observable<any> {
    const url = `${this.env.apiUrl + this.parity}`;
    return this.http.get(url);
  }

  getEncoding(): Observable<any> {
    const url = `${this.env.apiUrl + this.encoding}`;
    return this.http.get(url);
  }
  gettransportType(): Observable < any > {
    const url = `${this.env.apiUrl + this.TransportType}`;
    return this.http.get(url);
}
}
