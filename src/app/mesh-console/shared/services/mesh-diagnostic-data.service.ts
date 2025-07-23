import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EnvService} from "../../../core/services";
import {Observable} from "rxjs";
import {MeshDiagnosticModel} from "../models";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MeshDiagnosticDataService {
  private diagnosticDataUrl = '/v2/mesh-diagnostic';

  constructor(private http: HttpClient,
              private env: EnvService
  ) {}

  getLatestDiagnosticsData(xid: string, limit?: number): Observable<MeshDiagnosticModel[]> {
    let url = `${this.env.apiUrl}${this.diagnosticDataUrl}/latest/${xid}`;
    if (limit) {
      url = url + `?limit=${limit}`;
    }
    return this.http.get<MeshDiagnosticModel[]>(url).pipe(map((result) => {
      return result.map((data) => new MeshDiagnosticModel(data));
    }));
  }

  getDiagnosticsDataBetween(xid: string, from: any, to: any): Observable<MeshDiagnosticModel[]> {
    let url = `${this.env.apiUrl}${this.diagnosticDataUrl}/between/${xid}?from=${from}&to=${to}`;
    return this.http.get<MeshDiagnosticModel[]>(url).pipe(map((result) => {
      return result.map((data) => new MeshDiagnosticModel(data));
    }));
  }
}
