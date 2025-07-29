import {AbstractDataSourceService, EnvService} from "../../../core/services";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArrayWithTotalModel} from "../../../core/models";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class TofService extends AbstractDataSourceService<any> {
  private _total: number = 0;
  private tofUrl = "/v2/tof";

  constructor(http: HttpClient, env: EnvService) {
    // Corrected the order of arguments in the super call
    super(http, <any>[], env);
  }

  get total(): number {
    return this._total;
  }

  getTofMeshOn(params?: string): Observable<any[]> {
    const url = `${this.env.apiUrl}${this.dataSourceUrl}${params ? '?' + params : ''}`;
    return this.http.get<ArrayWithTotalModel<any>>(url).pipe(
      map((result) => {
        this._total = result.total;
        console.log(this._total);
        return result.items;
      })
    );
  }

  displayDataConfiguration(nodeAddress: number, targetAddress: number): Observable<any> {
    return this.http.put(`${this.env.apiUrl}${this.tofUrl}/command/${nodeAddress}/${targetAddress}`, '').pipe();
  }
}
