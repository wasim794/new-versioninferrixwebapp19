import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EnvService} from './env.service';

@Injectable()
export class ObservableWebSocketService {
  constructor(private env: EnvService) {
  }

  ws!: WebSocket;

  createObservableWebSocket(url: string): Observable<any> {
    this.ws = new WebSocket(this.env.wssUrl + url);
    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = (event) => observer.complete();
    });
  }

  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }

}
