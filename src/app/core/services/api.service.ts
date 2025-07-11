import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
// import {JwtService} from './jwt.service';
import {EnvService} from './env.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    // private jwtService: JwtService,
    private env: EnvService
  ) {}

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.env.apiUrl}${path}`, { params });
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${this.env.apiUrl}${path}`, body
    );
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${this.env.apiUrl}${path}`, body
    );
  }

  delete(path: any): Observable<any> {
    return this.http.delete(
      `${this.env.apiUrl}${path}`
    );
  }
}
