import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import {QOS_TYPE} from "../../../publisher/components/mqtt/dropdown.data";
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {MqttConfigurationModel, AdapptIntegrationService} from '../../../adappt-integration';

@Component({
  selector: 'app-mqtt-setting',
  templateUrl: './mqtt-setting.component.html'
})
export class MqttSettingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public showCertificate: boolean;
  public mqtt :MqttConfigurationModel = new MqttConfigurationModel();
  @Output() sideBarCloses = new EventEmitter<any>();
  saveSuccessMsg = 'is saved successfully';
  UIDICTIONARY : any;

  constructor(public dictionaryService:DictionaryService,
              private _commonService: CommonService,
              private _adappt: AdapptIntegrationService) { super(); }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('adapptIntegration').subscribe(data=>{
     this.UIDICTIONARY= this.dictionaryService.uiDictionary;
     });
    this.getMqttData();
  }
  public qosType = QOS_TYPE;
  useCertificate(event){
       this.showCertificate =  event.checked;
  }
  getMqttData(){
    this.subs.add(this._adappt.getMqttConfiguration().subscribe(data => {
     this.mqtt= data;
    }));
  }
  save(){
    if(this.mqtt.userName===undefined || this.mqtt.userPassword===undefined){
      this._commonService.notification("Please Fill the Required Field");
    }else {
      this.subs.add(this._adappt.saveMqttConfiguration(this.mqtt).subscribe(data => {
        this._commonService.notification(this.mqtt.userName + ' ' + this.saveSuccessMsg);
        this.sideBarCloses.emit(data);
      }));
    }
  }

}
