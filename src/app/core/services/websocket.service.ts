import {Injectable} from "@angular/core";
import {EnvService} from "./env.service";
import {Observable, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor(private env: EnvService) {
  }

  ws!: WebSocket;

  createWebSocket(url: string) {
    this.ws = new WebSocket(this.env.wssUrl + url);
    // console.log("fff");
  }

  subscribeWebsocket(): Observable<any> {
    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = (event) => observer.complete();
    });
  }
  closeWebSocket() {
    // Close the WebSocket connection
    this.ws.close();
  }

  sendMessageWebsocket(message: any) {
    this.ws.send(JSON.stringify(message));
  }
}
