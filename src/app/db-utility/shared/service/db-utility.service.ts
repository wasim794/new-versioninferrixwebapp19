import {Injectable} from '@angular/core';
import {ApiService, EnvService} from '../../../core/services';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbUtilityService {
  dbAction_Url = '/v2/system-actions/db-utils';
  dbAction_Upload_Url = '/v2/system-actions/db-utils/upload';
  dbSetting_Url = '/v2/system-setting';

  constructor( private api: ApiService, private http: HttpClient, private env: EnvService) { }

  action(actionObject: Object) {
    return this.api.post(`${this.dbAction_Url}`, actionObject);
  }

  saveBackupSetting(databaseSettingsModel: Object): Observable<any> {
    return this.api.post(`${this.dbSetting_Url}`, databaseSettingsModel);
  }

  restoreOrDbBackupOrList(databaseActions: Object): Observable<any> {
    return this.api.post(`${this.dbAction_Url}`, databaseActions);
  }

  downloadBackupOrList(fileName: any): Observable<any> {
   const REQUEST_PARAMS = new HttpParams().set('fileName', fileName.fileName);
   //ToDo need to check and implement it with using this.api.get way.
     /* return this.api.get(`${this.dbAction_Url}/${fileName}`, {
        params: REQUEST_PARAMS,
        responseType: 'arraybuffer'
      });*/
    const url = `${this.env.apiUrl + this.dbAction_Url}/${fileName}`;
       return this.http.get(url, {
         params: REQUEST_PARAMS,
         responseType: 'arraybuffer'
       });
    }

  dbUpload(dbUpload: any): Observable<any> {
    return this.api.post(`${this.dbAction_Upload_Url}`, dbUpload);
  }
}
