import {Injectable} from '@angular/core';
import {
  BandSettingsModel,
  GpioSettingsModel,
  LuxSettingsModel,
  NodeSettingsModel,
  PirSettingsModel,
  ProfileFilterModel,
  SwitchSettingsModel,
  RetransmissionSettingsModel
} from '../model';
import {Observable, Subject, throwError} from 'rxjs';
import {ApiService, EnvService} from '../../../core/services';
import {map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ArrayWithTotalModel} from "../../../core/models";
import {DataPointModel} from "../../../core/models/dataPoint";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileUrl = '/v2/json-data';
  copyProfileUrl = '/v2/json-data/copy';
  profileTypeUrl = '/v2/light-commissioning/profile/types';
  pirModel = {} as PirSettingsModel;
  luxModel = {} as LuxSettingsModel;
  switchModel = {} as SwitchSettingsModel;
  bandModel = {} as BandSettingsModel;
  gpioModel = {} as GpioSettingsModel;
  nodeSettings = {} as NodeSettingsModel;
  retransmissionSettings = {} as RetransmissionSettingsModel
  profileXid: any;
  private _total: number;

  private updateSubject = new Subject<any>();
  private saveSubject = new Subject<any>();
  private filterResponse = new Subject<any>();

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private env: EnvService
  ) {
  }

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

  query(profileFilter: ProfileFilterModel): Observable<any> {
    let query = '?';
    if (Object.keys(profileFilter.filters).length < 1) {
      query = query + 'eq(';
      Object.keys(profileFilter.filters)
      .forEach((key) => {
        query = query + key + ',' + profileFilter.filters[key] + ')';
      });
    } else {
      let filterSize = Object.keys(profileFilter.filters).length;
      query = query + 'and(';
      Object.keys(profileFilter.filters).forEach((key) => {
        if (filterSize === 1) {
          query = query + 'eq(' + key + ',' + profileFilter.filters[key] + '))';
        } else {
          query = query + 'eq(' + key + ',' + profileFilter.filters[key] + '),';
        }
        filterSize--;
      });
    }
    return this.api.get(`${this.profileUrl}${query}`);
  }


  public get(params?: any): Observable<ProfileFilterModel[]> {
    let url = `${this.env.apiUrl}${this.profileUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http
    .get<any>(url)
    .pipe(map((result) => {
      this._total = result.total;
      return result.items;
    }));
  }


  getProfileType(): Observable<any> {
    return this.api.get(`${this.profileTypeUrl}`);
  }

  setUpdateProfile(data) {
    this.updateSubject.next(data);
  }

  getUpdateProfile(): Observable<any> {
    return this.updateSubject.asObservable();
  }

  setSaveProfile(data) {
    this.saveSubject.next(data);
  }

  getSaveProfile(): Observable<any> {
    return this.saveSubject.asObservable();
  }

  getProfileByXid(profileXid: any): Observable<any> {
    return this.api.get(`${this.profileUrl}/${profileXid}`);
  }

  copyProfile(profileXid: string) {
    return this.api.put(`${this.copyProfileUrl}/${profileXid}`);
  }

  deleteProfile(profileXid: string) {
    return this.api.delete(`${this.profileUrl}/${profileXid}`);
  }

  setProfileXid(xid) {
    this.profileXid = xid;
  }

  getAllProfiles(limit: number, offset: number): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    return this.api.get(`${this.profileUrl}?and(or(eq(definition,LIGHT_CONTROLLER.PROFILE),eq(definition,DIGITAL_INPUT_CONTROLLER.PROFILE),eq(definition,RELAY_CONTROLLER.PROFILE),eq(definition,WRIST_BAND.PROFILE)),limit(${limit},${offset}))`);
  }

  saveProfile(profileObject) {
    return this.api.post(`${this.profileUrl}`, profileObject);
  }

  updateProfile(updateProfileObject) {
    const xid = updateProfileObject.xid;
    return this.api.put(`${this.profileUrl}/${xid}`, updateProfileObject);
  }

  setPirSettingModel(pirSetting) {
    this.pirModel = pirSetting;
  }

  setHoldTimeOneModel(nodeSetting) {
    this.nodeSettings = nodeSetting;
  }

  setHoldTimeTwoModel(nodeSetting) {
    this.nodeSettings = nodeSetting;
  }

  setLuxSettingModel(luxSetting) {
    this.luxModel = luxSetting;
  }

  setSwitchSettingModel(switchSettings) {
    this.switchModel = switchSettings;
  }

  setBandSettingModel(bandSettings) {
    this.bandModel = bandSettings;
  }

  setGpioSettingModel(gpioSetting) {
    this.gpioModel = gpioSetting;
  }

  setRetransmissionModel(retransmissionSettings) {
    this.retransmissionSettings = retransmissionSettings;
  }

  setProfileFilterSearch(data) {
    this.filterResponse.next(data);
  }

  getProfileFilterSearch(): Observable<any> {
    return this.filterResponse.asObservable();
  }


}
