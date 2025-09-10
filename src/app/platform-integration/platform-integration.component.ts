import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DictionaryService} from "../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';

@Component({
  standalone: true,
  providers: [DictionaryService],
  imports: [CommonModule, MatModuleModule],
  selector: 'app-platform-integration',
  templateUrl: './platform-integration.component.html',
  styleUrls: []
})
export class PlatformIntegrationComponent implements OnInit {
  mqttDetailShow = 'system-setting/platform-integration/mqtt';
  ProvisionDetail = 'system-setting/platform-integration/provision';
  Un_provisionDetail = 'system-setting/platform-integration/un-provision';
  deviceConfiguration = 'system-setting/platform-integration/deviceConfiguration';
  serverDetail = 'system-setting/platform-integration/serverDetails';
  navigateMessagesTrue = 'Navigation is successful!';
  navigateMessagesFalse = 'Navigation has failed!';
  UIDICTIONARY : any;

  constructor(private router: Router, public dictionaryService: DictionaryService,) {
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });

  }

  //get Route


  getMqttDetailData() {
    this.router.navigateByUrl(this.mqttDetailShow).then((e) => {
      // if (e) else
    });
  }

  getProvisionDetail() {
    this.router.navigateByUrl(this.ProvisionDetail).then((e) => {

    });
  }

  getUn_provisionDetail() {
    this.router.navigateByUrl(this.Un_provisionDetail).then((e) => {

    });
  }

  getDeviceConfiguration() {
    this.router.navigateByUrl(this.deviceConfiguration).then((e) => {

    });
  }

  getServerSidebar() {
    this.router.navigateByUrl(this.serverDetail).then((e) => {
      if (e) {
        console.log(this.navigateMessagesTrue);
      } else {
        console.log(this.navigateMessagesFalse);
      }
    });
  }


  showMqttDetail() {
    this.getMqttDetailData();
  }

  showProvisionDetail() {
    this.getProvisionDetail();
  }

  showUnprovisionedDevices() {
    this.getUn_provisionDetail();
  }

  showDeviceConfiguration() {
    this.getDeviceConfiguration();
  }

  serverSidebar() {
    this.getServerSidebar();
  }


}
