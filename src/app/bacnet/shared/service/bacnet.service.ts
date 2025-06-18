import {Injectable} from '@angular/core';
import {EnvService} from '../../../core/services';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
// import {BacnetIpLocalDeviceModel, BacnetLocalDeviceModel, BacnetMstpLocalDeviceModel, BacnetSenderPointModel} from '../model';
import {
  BacnetForeignDeviceModel,
  BacnetIpLocalDeviceModel,
  BacnetLocalDeviceModel,
  BacnetMstpLocalDeviceModel,
  BacnetSenderPointModel
} from '../../../bacnet';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BacnetService {

  private publisherBacnet = '/v2/publisher';
  private updateSubject = new Subject<any>();
  private saveSubject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private env: EnvService,
  ) {
  }

  private bacnetUrl = '/v2/bacnet/local-devices';
  private bacnetForeignDevice = '/v2/bacnet/local-devices/register-foreign-device'
  private _total!: number;

  get total(): number {
    return this._total;
  }

  get(params?: string): Observable<BacnetLocalDeviceModel<any>[]> {
    let url = `${this.env.apiUrl}${this.bacnetUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.get<BacnetLocalDeviceModel<any>[]>(url)
    .pipe(map((result) => {
      this._total = result.length;
      return result.map((model) => new BacnetLocalDeviceModel<any>(model));
    }));
  }

  getById(id: string): Observable<BacnetLocalDeviceModel<any>> {
    return this.http.get<BacnetLocalDeviceModel<any>>(`${this.env.apiUrl}${this.bacnetUrl}/${id}`)
    .pipe(map((model) => new BacnetLocalDeviceModel<any>(model)));
  }

  create(model: BacnetLocalDeviceModel<any>): Observable<BacnetLocalDeviceModel<any>> {
    return this.http.post<BacnetLocalDeviceModel<any>>(`${this.env.apiUrl}${this.bacnetUrl}`, model.toJson())
    .pipe(map((data) => new BacnetLocalDeviceModel<any>(data)));
  }

  update(id: string, model: BacnetLocalDeviceModel<any>): Observable<BacnetLocalDeviceModel<any>> {
    return this.http.put<BacnetLocalDeviceModel<any>>(`${this.env.apiUrl}${this.bacnetUrl}/${id}`, model.toJson())
    .pipe(map((data) => new BacnetLocalDeviceModel<any>(data)));
  }

  delete(id: string): Observable<BacnetLocalDeviceModel<any>> {
    return this.http.delete<BacnetLocalDeviceModel<any>>(`${this.env.apiUrl}${this.bacnetUrl}/${id}`)
    .pipe(map((model) => new BacnetLocalDeviceModel(model)));
  }

  getDefaultIpDeviceModel(): BacnetIpLocalDeviceModel {
    const model = new BacnetIpLocalDeviceModel();
    model.deviceId = 0;
    model.deviceName = 'IP Bacnet Device';
    model.broadcastAddress = '255.255.255.255';
    model.port = 47808;
    model.subnet = 24;
    model.localNetworkNumber = 0;
    model.foreignBBMDPort = 47808;
    model.foreignBBMDTimeToLive = 300;
    model.retries = 2;
    model.segTimeout = 5000;
    model.timeout = 6000;
    model.segWindow = 5;
    model.reuseAddress = false;
    return model;
  }

  getDefaultMstpDeviceModel(): BacnetMstpLocalDeviceModel {
    const model = new BacnetMstpLocalDeviceModel();
    model.deviceId = 0;
    model.deviceName = 'MS/TP Bacnet Device';
    model.baudRate = 9600;
    model.thisStation = 0;
    model.localNetworkNumber = 0;
    model.retries = 2;
    model.segTimeout = 5000;
    model.timeout = 6000;
    model.segWindow = 5;
    model.maxMaster = 127;
    model.maxInfoFrames = 1;
    model.usageTimeout = 20;
    model.retryCount = 1;
    model.useRealtime = false;
    return model;
  }

  getBacnetPublisherPoint(xid: string): Observable<BacnetSenderPointModel> {
    return this.http.get<BacnetSenderPointModel>(`${this.env.apiUrl}/v2/bacnet/publisher-point/${xid}`)
      .pipe(map((result) => new BacnetSenderPointModel(result)));
  }

  sendForeignDeviceRegistration(id: string, model: BacnetForeignDeviceModel) {
    return this.http.post<any>(`${this.env.apiUrl}${this.bacnetForeignDevice}/${id}`, model.toJson());
  }
}
