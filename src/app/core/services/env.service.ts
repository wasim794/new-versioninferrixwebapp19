import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  public apiUrl: string = '';
  public wssUrl: string = '';
  public enableDebug = true;

  private readonly apiPath = '/rest';
  private readonly wsPath = '/rest/ws';
  private readonly localDevHostname = 'localhost';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const hostname = window.location.hostname;

      if (hostname === this.localDevHostname) {
        // Use proxy (relative URL) during development
        this.apiUrl = this.apiPath;
        this.wssUrl = this.wsPath;
      } else {
        // Production or other environment: use full URLs
        const protocol = window.location.protocol;
        const port = window.location.port || (protocol === 'https:' ? '443' : '80');

        this.apiUrl = `${protocol}//${hostname}:${port}${this.apiPath}`;
        this.wssUrl = `${protocol === 'https:' ? 'wss:' : 'ws:'}//${hostname}:${port}${this.wsPath}`;
      }

      if (this.enableDebug) {
        console.log('EnvService (browser) apiUrl:', this.apiUrl);
        console.log('EnvService (browser) wssUrl:', this.wssUrl);
      }
    } else {
      // Server-side: fallback to backend IP directly (for SSR, if used)
      this.apiUrl = 'http://192.168.29.16/rest';
      this.wssUrl = 'wss://192.168.29.16/rest/ws';

      if (this.enableDebug) {
        console.log('EnvService (server) apiUrl:', this.apiUrl);
        console.log('EnvService (server) wssUrl:', this.wssUrl);
      }
    }
  }
}
