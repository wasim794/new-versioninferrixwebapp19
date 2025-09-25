import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { DictionaryService } from '../core/services/dictionary.service';
import {CommonService} from '../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../common';
import {MqttConfigurationModel, MqttSettingComponent} from '../adappt-integration';
import {AdapptIntegrationService} from '../adappt-integration/service/adappt-integration.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';



@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, MqttSettingComponent],
  providers: [AdapptIntegrationService, CommonService, DictionaryService],
  selector: 'app-adapt-integration',
  templateUrl: './adappt-integration.component.html',
  styleUrls: []
})
export class AdapptIntegrationComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('mqtt_setting_form') public mqttSetting!: MatSidenav;
  public mqtt :MqttConfigurationModel = new MqttConfigurationModel();
  public userName:any;
  enableMessage = 'Enable Successfully';
  disableMessage= 'Disable Successfully';
  provisionalUrl = 'system-setting/adapt/provision';
  unProvisionalURL = 'system-setting/adapt/un-provision';
  UIDICTIONARY : any;


  constructor(public dictionaryService:DictionaryService , private router: Router,
              private _adappt:AdapptIntegrationService,   public _commonService: CommonService,)  {  super(); }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('adapptIntegration').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getMqttData();
  }

  openSideBar() {
    this.mqttSetting.open().then(r => console.log(r));
  }

  showPages(data:any){
      if(data == 'Provision'){
        this.router.navigateByUrl(this.provisionalUrl)
      }else if(data == 'Unprovisioned'){
        this.router.navigateByUrl(this.unProvisionalURL);
      }

  }

   getMqttData(){
   this.subs.add(this._adappt.getMqttConfiguration().subscribe((data:any) => {
     this.mqtt.autoReconnect = data.autoReconnect;
   this.userName=data.userName;
   }));
   }

  sideBarClose(mqttSetting: any){
    this.mqttSetting.close();
    this.getMqttData();
  }

  mqttStatus(event: any) {
    this.subs.add(this._adappt.enableMqttConfiguration(event.checked).subscribe(data => {
      this.mqtt.autoReconnect===true?this._commonService.notification(this.enableMessage)
        :this._commonService.notification(this.disableMessage)

    }));
  }
  goBack() {
    this._commonService.goBackHistory();
  }
}
