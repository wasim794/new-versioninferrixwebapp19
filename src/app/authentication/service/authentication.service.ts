import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EnvService } from '../../core/services/env.service';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authUrl = '/v2/auth/login';
  private refreshUrl = '/v2/auth/refresh';
  private jwtHelper = new JwtHelperService();
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(this.env.apiUrl + this.authUrl, { username, password })
      .pipe(
        map(result => {
          this.setToken(result.token);
          return true;
        }),
        catchError(error => throwError(() => error))
      );
  }
  refreshToken(): Observable<boolean> {
    return this.http.post<{ token: string }>(this.env.apiUrl + this.refreshUrl, null)
      .pipe(
        map(result => {
          this.setToken(result.token);
          return true;
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      this.router.navigate(['/login']);
    }
  }
  get loggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('access_token'); // :white_check_mark: direct string
  }
  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', token); // :white_check_mark: no JSON.stringify
      this.setTokenRefreshTimer(token);
    }
  }
  private setTokenRefreshTimer(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const expiration = this.jwtHelper.getTokenExpirationDate(token);
    if (!expiration) return;
    const timeout = expiration.getTime() - Date.now() - (60 * 1000);
    if (timeout > 0) {
      setTimeout(() => {
        this.refreshToken().subscribe({
          error: () => this.logout()
        });
      }, timeout);
    }
  }
}