import {Observable} from 'rxjs';
import {ArrayWithTotalModel, ModuleDefinitionModel} from '../models';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {EnvService} from './env.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private publisherTypesUrl = '/v2/publisher-types';
  private _typeTotal!: number;

  get typeTotal(): number {
    return this._typeTotal;
  }

  public getTypes(params?: string): Observable<ModuleDefinitionModel[]> {
    let url = `${this.env.apiUrl}${this.publisherTypesUrl}`;
    if (params) {
      url = url + `?${params}`;
    }
    return this.http.get<ArrayWithTotalModel<any>>(url)
    .pipe(map((result) => {
      this._typeTotal = result.total;
      return result.items.map((i) => new ModuleDefinitionModel(i));
    }));
  }
}
