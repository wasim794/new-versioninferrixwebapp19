import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from '../../core/services/env.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authUrl = '/v2/auth/login';
  private refreshUrl = '/v2/auth/refresh';

  constructor(
    private http: HttpClient,
    private env: EnvService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(this.env.apiUrl + this.authUrl, { username, password })
      .pipe(
        map(result => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('access_token', JSON.stringify(result.token));
          }
          return true;
        })
      );
  }

  refreshToken(): Observable<boolean> {
    return this.http.post<{ token: string }>(this.env.apiUrl + this.refreshUrl, null)
      .pipe(
        map(result => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('access_token', JSON.stringify(result.token));
          }
          return true;
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
    }
  }

  get loggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && (localStorage.getItem('access_token') !== null);
  }
}
