import {Component, OnInit, inject} from '@angular/core';
import {DictionaryService, WebsocketService} from "../../../core/services";
import {MeshSinkService} from "../../shared/services";
import { ConfigurationService } from '../../../services/configuration.service';
import { ObservableWebSocketService } from '../../../core/services';
import {UnsubscribeOnDestroyAdapter} from "../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {NumericKeyStaticData} from "../../../common";
import {forkJoin} from "rxjs";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule],
  providers: [DictionaryService, MeshSinkService, ConfigurationService, ObservableWebSocketService],
  selector: 'app-sink-setting-form',
  templateUrl: './sink-setting-form.component.html',
  styleUrls: []
})
export class SinkSettingFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  roles!: NumericKeyStaticData[];
  isStackRunning!: boolean;
  address!: number;
  network!: string;
  channel!: number;
  token!: any;
  role!: number;
   UIDICTIONARY: any;
  messages: any;
  websocket_URL = '/temporary-resources?token=';
   private _configurationService = inject(ConfigurationService);
    private observableWebSocketService = inject(ObservableWebSocketService);
  websocketResponse: any;

  constructor(
    public dictionaryService: DictionaryService,
    private _service: MeshSinkService,
    private _WebSocketService: WebsocketService,
  ) {
    super();
  }

  ngOnInit(): void {
     this.token = (localStorage.getItem('access_token'));
     this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
     this.getSocketNewAdded();
    
      this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
        this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
     
      
  }

  private getAllMeshNodeSings(){
    this.subs.add(forkJoin([
      this._service.getRoles(),
      this._service.getAddress(),
      this._service.getNetwork(),
      this._service.getChannel(),
      this._service.getRole()
    ])
      .subscribe((result) => {
        console.log(result);
        this.roles = result[0];
        // this.address = result[1].confirmMessage.attributeValue;
        // this.network = result[2].confirmMessage.attributeValue.toUpperCase();
        // this.channel = result[3].confirmMessage.attributeValue;
        // this.role = result[4].confirmMessage.attributeValue;
        this.isStackRunning = true;
         
      
        // console.log(this.roles, this.address, this.network, this.channel, this.role);
        // if((this.websocketResponse.payload.result.confirmMessage.attributeName == "nodeAddress")){
        //    console.log("Initial result", this.websocketResponse.payload.result.confirmMessage);
        //    this.address = this.websocketResponse.payload.result.attributeValue;
        // }
      }));
  }

  getSocketNewAdded(){
     const message = {
    "statuses": ["VIRGIN", "SCHEDULED", "RUNNING", "TIMED_OUT", "CANCELLED", "SUCCESS", "ERROR"],
    "resourceTypes": ["MESH_SINK_ADDRESS", "MESH_SINK_ROLE", "MESH_SINK_CHANNEL", "MESH_SINK_NETWORK", "MESH_SINK_STOP", "MESH_SINK_START"],
    "requestType": "SUBSCRIPTION"
};

    this._configurationService.connect(message);
     this._WebSocketService.subscribeWebsocket().subscribe((data: any) => {
      this.websocketResponse = JSON.parse(data);
      console.log(this.websocketResponse);
      if(this.websocketResponse?.messageType === 'RESPONSE'){
        console.log("Initial Response");
        this.getAllMeshNodeSings();
        // console.log(this.websocketResponse.payload.result.confirmMessage);
        
      }
      if (this.websocketResponse?.payload?.status === 'SUCCESS' && this.websocketResponse?.payload?.result?.confirmMessage) {
            console.log('WebSocket confirm message:', this.websocketResponse.payload.result.confirmMessage);
            // this.address = addressResponse?.confirmMessage?.attributeValue ?? null;
            // Update other properties (network, channel, role) if service calls are added
            if((this.websocketResponse.payload.result.confirmMessage.attributeName == "nodeAddress")){
           console.log("Initial result", this.websocketResponse.payload.result.confirmMessage);
           this.address = this.websocketResponse.payload.result.confirmMessage.attributeValue;
        }
         if((this.websocketResponse.payload.result.confirmMessage.attributeName == "networkChannel")){
           console.log("Initial result", this.websocketResponse.payload.result.confirmMessage);
           this.network = this.websocketResponse.payload.result.confirmMessage.attributeValue;
        }
        
        if((this.websocketResponse.payload.result.confirmMessage.attributeName == "networkAddress")){
           console.log("Initial result", this.websocketResponse.payload.result.confirmMessage);
           this.channel = this.websocketResponse.payload.result.confirmMessage.attributeValue;
        }

        if((this.websocketResponse.payload.result.confirmMessage.attributeName == "nodeRole")){
           console.log("Initial result", this.websocketResponse.payload.result.confirmMessage);
           this.role = this.websocketResponse.payload.result.confirmMessage.attributeValue;
          //  this.roles = this.websocketResponse.payload.result.confirmMessage.attributeValue;

        }

          }
    });
  }

  pushAddress(): void {
    this.subs.add(this._service.setAddress(this.address).subscribe((data) => {
      this.messages = data;
      console.log(this.websocketResponse);
      // SinkSettingFormComponent.showMessages();
    }));
  }

  pushNetwork(): void {
    this.subs.add(this._service.setNetwork(this.network).subscribe((data) => {
      this.messages = data;
      // SinkSettingFormComponent.showMessages();
    }));
  }

  pushChannel(): void {
    this.subs.add(this._service.setChannel(this.channel).subscribe((data) => {
      this.messages = data;
      // SinkSettingFormComponent.showMessages();
    }));
  }

  pushRole(): void {
    this.subs.add(this._service.setRole(this.role).subscribe((data) => {
      this.messages = data;
      // SinkSettingFormComponent.showMessages();
    }));
  }

  startStack(): void {
    this.subs.add(this._service.startStack().subscribe((data) => {
      this.messages = data;
      if(this.websocketResponse?.messageType === "NOTIFICATION"){
         if (this.websocketResponse?.payload?.resourceType === "MESH_SINK_START") {
        // console.log("Start here");
        this.isStackRunning = true;
      }
      }
      // SinkSettingFormComponent.showMessages();
    }));
  }

  stopStack(): void {
    this.subs.add(this._service.stopStack().subscribe((data) => {
      this.messages = data;
      console.log(this.websocketResponse);
      if(this.websocketResponse?.messageType === "NOTIFICATION"){

      if (this.websocketResponse?.payload?.resourceType === "MESH_SINK_STOP") {
        // console.log("Stop here");
        this.isStackRunning = false;
      }
    }

      // SinkSettingFormComponent.showMessages();
    }));
  }

  private static showMessages() {
    (<any>$('#messages')).show();
    (<any>$('#messages')).fadeOut(2000);
  }
}
