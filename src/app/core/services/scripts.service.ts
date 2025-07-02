import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EnvService} from "./env.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) {
  }

  private scriptsUrl = '/v2/script';

  public getEngines(): Observable<ScriptEngineModel[]> {
    return this.http.get<ScriptEngineModel[]>(`${this.env.apiUrl}${this.scriptsUrl}/engines`)
    .pipe(map((result) => {
      return result.map((i) => new ScriptEngineModel(i));
    }));
  }
}

export class ScriptEngineModel {
  engineName!: string;
  engineVersion!: string;
  extensions!: string[];
  languageName!: string;
  languageVersion!: string;
  mimeTypes!: string[];


  constructor(model?: Partial<ScriptEngineModel>) {
    if (model) {
      Object.assign(this, model);
    }
  }
}
