import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EnvService} from "../../../core/services";
import {Observable} from "rxjs";
import {MeshStackStatusConfirmMessageModel} from "../models/mesh-stack-status-confirm-message.model";
import {map} from "rxjs/operators";
import {MeshScratchpadStatusModel} from "../models";
import {ArrayWithTotalModel} from "../../../core/models";
import {FileModel} from "../../../core/models/files/file.model";

@Injectable({
  providedIn: 'root'
})
export class MeshOtaService {
  private meshScratchpadUrl = '/v2/mesh-console/ota';
  private _totalUploadedFirmware: any;
  private _totalNodeStatus: any;

  constructor(private http: HttpClient,
              private env: EnvService
  ) {}


  get totalUploadedFirmware() {
    return this._totalUploadedFirmware;
  }

  get totalNodeStatus() {
    return this._totalNodeStatus;
  }

  getSinkFirmwareStatus(): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.get<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshScratchpadUrl}/status`)
      .pipe(map((result) => {return new MeshStackStatusConfirmMessageModel(result);}));
  }

  updateSinkScratchpad(): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.put<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshScratchpadUrl}/update-scratchpad`, '')
      .pipe(map((result) => {return new MeshStackStatusConfirmMessageModel(result);}));
  }

  scratchpadStatusCollectionStart(): Observable<String> {
    return this.http.put<String>(`${this.env.apiUrl}${this.meshScratchpadUrl}/scratchpad-status-start`, '')
      .pipe(map((result) => {return result;}));
  }

  scratchpadStatusCollectionStop(): Observable<String> {
    return this.http.put<String>(`${this.env.apiUrl}${this.meshScratchpadUrl}/scratchpad-status-stop`, '')
      .pipe(map((result) => {return result;}));
  }

  nodeStatus(params?: string): Observable<MeshScratchpadStatusModel[]> {
    let url = `${this.env.apiUrl}${this.meshScratchpadUrl}/node-status`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.get<ArrayWithTotalModel<MeshScratchpadStatusModel>>(url)
      .pipe(map((result) => {
        this._totalNodeStatus = result.total;
        return result.items.map((node) => new MeshScratchpadStatusModel(node));
      }));
  }

  updateLegacyFirmware(sequence:number): Observable<String> {
    let url = `${this.env.apiUrl}${this.meshScratchpadUrl}/update`;
    if (sequence) {
      url = url + `?sequence=${sequence}`;
    }

    return this.http.put<String>(url, '')
      .pipe(map((response) => {return response}));
  }

  startFirmware(name: string, sequence: number): Observable<MeshStackStatusConfirmMessageModel> {
    let url = `${this.env.apiUrl}${this.meshScratchpadUrl}/start`;
    if((name==='') && (sequence===0)){
      // return false;
    }else {
      if (name) {
        url = url + `?name=${name}`;
      }

      if (sequence) {
        url = url + `&sequence=${sequence}`;
      }
    }
    return this.http.put<MeshStackStatusConfirmMessageModel>(url, '')
      .pipe(map((result) => {return new MeshStackStatusConfirmMessageModel(result);}));
  }

  clearSinkScratchpad(): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.delete<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshScratchpadUrl}/clear`)
    .pipe(map((result) => {return new MeshStackStatusConfirmMessageModel(result);}));
  }

  transferFirmware(name: string): Observable<MeshStackStatusConfirmMessageModel> {
    let url = `${this.env.apiUrl}${this.meshScratchpadUrl}/transfer`;
    if(name===''){
      // return false;
    }else {
      if (name) {
        url = url + `?name=${name}`;
      }
    }
    return this.http.put<MeshStackStatusConfirmMessageModel>(url, '')
      .pipe(map((result) => {return new MeshStackStatusConfirmMessageModel(result);}));
  }

  uploadFirmware(upload: any): Observable<FileModel[]> {
    return this.http.post<FileModel[]>(`${this.env.apiUrl}${this.meshScratchpadUrl}/upload`, upload)
      .pipe(map((result) => { return result.map((response) => new FileModel(response));}));
  }

  getUploadedFirmware(): Observable<FileModel[]> {
    return this.http.get<FileModel[]>(`${this.env.apiUrl}${this.meshScratchpadUrl}`)
      .pipe(map((result) => { return result.map((response) => new FileModel(response));}));
  }

  deleteUploadedFirmware(name: string): Observable<String> {
    return this.http.delete<String>(`${this.env.apiUrl}${this.meshScratchpadUrl}/${name}`)
      .pipe(map((response) => {return response;}));
  }

  updateFirmware(action: string, sequence: any, targetCrc: any, delay: any): Observable<MeshStackStatusConfirmMessageModel> {
    let url = `${this.env.apiUrl}${this.meshScratchpadUrl}/non-legacy-update`;
    if (action) {
      url = url + `?action=${action}`;
    }

    if (sequence) {
      url = url + `&sequence=${sequence}`;
    }

    if (targetCrc) {
      url = url + `&targetCrc=${targetCrc}`;
    }

    if (delay) {
      url = url + `&delay=${delay}`;
    }
    return this.http.put<MeshStackStatusConfirmMessageModel>(url, '')
      .pipe(map((result) => {return new MeshStackStatusConfirmMessageModel(result);}))
  }
}
