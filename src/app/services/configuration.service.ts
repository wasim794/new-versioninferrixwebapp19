import {Injectable} from '@angular/core';
// import {ObservableWebSocketService} from '../core/services';
import {WebsocketService} from '../core/services';
import {timer} from 'rxjs';

@Injectable()
export class ConfigurationService {
  constructor(
    private _webSocketService: WebsocketService
  ) {
  }

  waitForConnectionDelay = 5000;
  connect(message: any) {
    const _timer = timer(this.waitForConnectionDelay);
    _timer.subscribe(t => {
      this._webSocketService.sendMessageWebsocket(message);
    });
  }

  closeWebSocket() {
    this._webSocketService.closeWebSocket();
  }
}
