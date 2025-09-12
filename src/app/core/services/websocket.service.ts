import { Injectable } from "@angular/core";
import { EnvService } from "./env.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws!: WebSocket;
  private wsOpen = false;
  private messageQueue: string[] = [];

  constructor(private env: EnvService) {}

  createWebSocket(url: string): void {
    this.ws = new WebSocket(this.env.wssUrl + url);

    this.ws.onopen = () => {
      console.log("WebSocket connection opened.");
      this.wsOpen = true;

      // Send all queued messages
      this.messageQueue.forEach(msg => this.ws.send(msg));
      this.messageQueue = [];
    };

    this.ws.onclose = () => {
      this.wsOpen = false;
      console.warn("WebSocket connection closed.");
      // Optional: add reconnect logic here if needed
    };

    this.ws.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };
  }

  subscribeWebsocket(): Observable<any> {
    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = () => observer.complete();
    });
  }

  closeWebSocket(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessageWebsocket(message: any): void {
    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }

    if (this.wsOpen && this.ws.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message);
      this.ws.send(message);
    } else {
      console.warn("WebSocket not open yet, queueing message.");
      this.messageQueue.push(message);
    }
  }
}
