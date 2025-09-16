import {Component, OnInit, inject} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {MeshConsoleService} from "../../shared/services";
import {DictionaryService, WebsocketService} from "../../../core/services";
import { ConfigurationService } from '../../../services/configuration.service';
import { ObservableWebSocketService } from '../../../core/services';
import {NumericKeyStaticData} from "../../../common/static-data/static-data";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule],
  providers: [DictionaryService, MeshConsoleService, ConfigurationService, ObservableWebSocketService, WebsocketService],
  selector: 'app-diagnostics-setting-form',
  templateUrl: './diagnostics-setting-form.component.html',
  styleUrls: []
})
export class DiagnosticsSettingFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  intervals!: NumericKeyStaticData[];
  interval!: number;
  messages: any;
  websocket_URL = '/temporary-resources?token=';
  token!: any;
  websocketResponse: any;
  UIDICTIONARY: any;
  private _configurationService = inject(ConfigurationService);
    private observableWebSocketService = inject(ObservableWebSocketService);

  constructor(
    public dictionaryService: DictionaryService,
    private _service: MeshConsoleService,
    private _WebSocketService: WebsocketService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.token = (localStorage.getItem('access_token'));
     this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
      this.getSocketNewAdded();
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    
  }

  private getDiagnosticsIntervals(){
   this._service.getDiagnosticsInterval().subscribe(data => this.intervals = data);
  }

  getSocketNewAdded(){
     const message = {
    "statuses": ["VIRGIN", "SCHEDULED", "RUNNING", "TIMED_OUT", "CANCELLED", "SUCCESS", "ERROR"],
    "resourceTypes": ["MESH_DIAGNOSTICS_INTERVAL"],
    "requestType": "SUBSCRIPTION"
};

    this._configurationService.connect(message);
     this._WebSocketService.subscribeWebsocket().subscribe((data: any) => {
      this.websocketResponse = JSON.parse(data);
      console.log(this.websocketResponse);
      if(this.websocketResponse?.messageType === 'RESPONSE'){
        this.getDiagnosticsIntervals();
      }
    });
  }


  pushInterval(): void {
    this._service.setDiagnosticsInterval(this.interval).subscribe(data => {
      this.messages = data;
      DiagnosticsSettingFormComponent.showMessages();
    });
  }

  private static showMessages() {
    // (<any>$('#messages')).show();
    // (<any>$('#messages')).fadeOut(10000);
  }
  
}
