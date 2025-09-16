import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CommonService} from '../../../services/common.service';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {MqttFormComponent} from './mqtt-form/mqtt-form.component';
import {MqttConnectionParametersModel} from '../../models/mqtt-connection-parameters.model';
import {PlatformIntegrationService} from '../../service/platform-integration.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {SystemSettingService} from "../../../core/services";
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [MatSidenav, MqttFormComponent, CommonModule, MatModuleModule],
  providers: [CommonService, PlatformIntegrationService, SystemSettingService, DictionaryService],
  selector: 'app-mqtt-configuration',
  templateUrl: './mqtt-configuration.component.html',
  styleUrls: []
})
export class MqttConfigurationComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('mqttDrawer') public mqttDrawer!: MatSidenav;
  @ViewChild(MqttFormComponent) mqttFormComponent!: MqttFormComponent;
  mqttList: any = new MqttConnectionParametersModel();
  listData: any;
  zeroRecods!: boolean;
  enabled!: boolean;
  enableMessage = 'Enable Successfully';
  disableMessage= 'Disable Successfully';
  UIDICTIONARY : any;

  constructor(private dialog: MatDialog,
              public commonService: CommonService,
              private platformIntegrationService: PlatformIntegrationService,
              private systemSettingService: SystemSettingService,
              public dictionaryService: DictionaryService,
  ) {
    super();
  }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.getMqttList();
    this.systemSettingService.getSystemSettingsByKey('thingsboardIntegration')
      .subscribe((data) => this.enabled = data === 'Y');
  }

  getNext(event: any) {
    this.getMqttList();
  }

  getMqttList() {
    this.subs.add(this.platformIntegrationService.getMqttConfiguration().subscribe((data: any) => {
        this.mqttList = data;
         this.listData = [];
        this.listData=[this.mqttList];
      },
    ));
  }

  mqttStatus(event: any) {
    this.subs.add(this.platformIntegrationService.enableMqttConfiguration(event.checked).subscribe(data => {
      this.mqttList.autoReconnect===true?this.commonService.notification(this.enableMessage)
        :this.commonService.notification(this.disableMessage);
    }));
  }

  mqttUser(event: any) {
    this.mqttDrawer.open();
  }

  allClose(event: any) {
    this.mqttDrawer.close();
    this.getNext(event);
  }

  goBack() {
    this.commonService.goBackHistory();
  }
}

