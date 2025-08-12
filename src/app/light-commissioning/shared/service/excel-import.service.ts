import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {EnvService} from "../../../core/services";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ExcelImportService {
  ledControllerDataImport = '/v2/import/light-commissioning';

  constructor(private http: HttpClient, private env: EnvService) {}

  ledControllerImportExcelData(excelFile): Observable<any> {
    return this.http.post(`${this.env.apiUrl}${this.ledControllerDataImport}`, excelFile);
  }
}
