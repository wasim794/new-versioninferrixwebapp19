import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  public apiUrl: string;
  public wssUrl: string;
  public enableDebug = true;

  constructor() {
    const window = this.getWindow();
    let port = window.location.port;

    // Determine protocol and default port
    if (window.location.protocol === 'https:') {
      if (!port) {
        port = '443';
      }
      this.apiUrl = 'https:';
      this.wssUrl = 'wss:';
    } else {
      if (!port) {
        port = '80';
      }
      this.apiUrl = 'http:';
      this.wssUrl = 'ws:';
    }

    // Construct URLs
    this.apiUrl += `//${window.location.hostname}:${port}/rest`;
    this.wssUrl += `//${window.location.hostname}:${port}/rest/ws`;
  }

  private getWindow(): Window {
    return window;
  }
}


//end here
