import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EnvService} from "../../../core/services";
import {Observable} from "rxjs";
import {
  BaseConfirmMessageModel,
  CsapReadConfirmModel,
  MeshConfirmCsapReadMessageModel
} from "../models";
import {map} from "rxjs/operators";
import {NumericKeyStaticData} from "../../../common/static-data/static-data";
import {MeshStackStatusConfirmMessageModel} from "../models/mesh-stack-status-confirm-message.model";

@Injectable({
  providedIn: 'root'
})
export class MeshSinkService {
  private meshSinkUrl = '/v2/mesh-console/sink';

  constructor(private http: HttpClient,
              private env: EnvService
  ) {
  }

  getAddress(): Observable<MeshConfirmCsapReadMessageModel> {
    return this.http.get<MeshConfirmCsapReadMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/address`)
    .pipe(map((result) => {
      return new MeshConfirmCsapReadMessageModel(result);
    }));
  }

  setAddress(address: number): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.put<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/address/${address}`, '')
    .pipe(map((result) => new MeshStackStatusConfirmMessageModel(result)))
  }

  getNetwork(): Observable<MeshConfirmCsapReadMessageModel> {
    return this.http.get<MeshConfirmCsapReadMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/network`)
    .pipe(map((result) => {
      return new MeshConfirmCsapReadMessageModel(result);
    }));
  }

  setNetwork(network: string): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.put<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/network/${network}`, '')
    .pipe(map((result) => new MeshStackStatusConfirmMessageModel(result)))
  }

  getChannel(): Observable<MeshConfirmCsapReadMessageModel> {
    return this.http.get<MeshConfirmCsapReadMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/channel`)
    .pipe(map((result) => {
      return new MeshConfirmCsapReadMessageModel(result);
    }));
  }

  setChannel(channel: number): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.put<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/channel/${channel}`, '')
    .pipe(map((result) => new MeshStackStatusConfirmMessageModel(result)))
  }

  getRole(): Observable<MeshConfirmCsapReadMessageModel> {
    return this.http.get<MeshConfirmCsapReadMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/role`)
    .pipe(map((result) => {
      return new MeshConfirmCsapReadMessageModel(result);
    }));
  }

  setRole(role: number): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.put<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/role/${role}`, '')
    .pipe(map((result) => new MeshStackStatusConfirmMessageModel(result)))
  }

  stopStack(): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.get<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/stop-stack`)
    .pipe(map((result) => new MeshStackStatusConfirmMessageModel(result)));
  }

  startStack(): Observable<MeshStackStatusConfirmMessageModel> {
    return this.http.get<MeshStackStatusConfirmMessageModel>(`${this.env.apiUrl}${this.meshSinkUrl}/start-stack`)
    .pipe(map((result) => new MeshStackStatusConfirmMessageModel(result)));
  }

  getRoles(): Observable<NumericKeyStaticData[]> {
    return this.http.get(`${this.env.apiUrl}${this.meshSinkUrl}/roles`)
    .pipe(map((result) => {
      const roles: NumericKeyStaticData[] = [];
      Object.entries(result).forEach(([key, value]) => {
        roles.push({key: Number(key), value: value})
      });
      return roles;
    }));
  }
}
