import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EnvService} from "./env.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  private _uiDictionary!: Map<string, string>;
  private dictionaryUrl = '/v2/dictionary';
  public UIDICTIONARY:any;

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }


  public getUIDictionary(module: string) {
    return this.http.get(`${this.env.apiUrl}${this.dictionaryUrl}/ui/${module}`)
    .pipe(map(data => {
      this._uiDictionary = new Map<string, string>();
      Object.entries(data).forEach(([key, value]) => {
        this._uiDictionary.set(key, value);
      })
    }));
  }

  get uiDictionary(): Map<string, string> {
    return this._uiDictionary;
  }
}

