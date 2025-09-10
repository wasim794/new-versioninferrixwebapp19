import { Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CommonService} from '../../../../services/common.service';
import {MqttConnectionParametersModel} from '../../../models/mqtt-connection-parameters.model';
import { MatDialog } from '@angular/material/dialog';
import {PlatformIntegrationService} from '../../../service/platform-integration.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {QOS_TYPE} from "../../../../publisher/components/mqtt/dropdown.data";
import { MatDrawer, MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';
import {MqttConfigurationComponent} from '../mqtt-configuration.component';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { MatModuleModule } from '../../../../common/mat-module';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [MatSidenav, MatModuleModule, CommonModule],
  providers: [CommonService, PlatformIntegrationService, DictionaryService],
  selector: 'app-mqtt-form',
  templateUrl: './mqtt-form.component.html'
})
export class MqttFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit  {
  mqttConnections = new MqttConnectionParametersModel();
  @Output() allClose = new EventEmitter<any>();
  @ViewChild('mqttDrawer') public mqttDrawer!: MatSidenav;
  listData:any;
  public qosType = QOS_TYPE;
  mqttListError: any = [];
  private successfully= "Submit successfully ";
  UIDICTIONARY : any;

  constructor(private dialog: MatDialog,private platformIntegrationService: PlatformIntegrationService,
    private commonService: CommonService, private mqttConfigurationComponent :MqttConfigurationComponent ,public dictionaryService: DictionaryService,) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getMqttList();
  }
  getNext() {
    this.getMqttList();
  }
  getMqttList() {
    this.subs.add(this.platformIntegrationService.getMqttConfiguration().subscribe((data: any) => {
        this.mqttConnections = data;
        this.listData=[];
        this.listData.push(this.mqttConnections);
      },
    ));
  }
  saveMqtt(){
    this.subs.add(this.platformIntegrationService.saveMqttConfiguration(this.mqttConnections).subscribe((data: any) => {
      this.commonService.notification(this.successfully);
      this.allClose.emit(data);
      this.mqttConfigurationComponent.ngOnInit();
    }));
  }

}
