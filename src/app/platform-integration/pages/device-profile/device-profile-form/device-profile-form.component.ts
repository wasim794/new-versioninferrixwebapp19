import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {CommonService} from '../../../../services/common.service';
import {PlatformIntegrationService} from '../../../service/platform-integration.service';
import {QOS_TYPE} from "../../../../publisher/components/mqtt/dropdown.data";
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import {MatSidenav} from '@angular/material/sidenav';
import {MqttIntegrationModel} from '../../../models/mqtt-integration.model';
import {DeviceTypeModel} from '../../../models/device-type.model';
import {DeviceProfileModel} from '../../../../platform-integration';
import {DictionaryService} from "../../../../core/services";
import {DEVICE_PROFILE_PROVISION_TYPE, DEVICE_PROFILE_TYPE, DEVICE_TRANSPORT_TYPE} from '../../../shared/platform-integration-dropdown.data';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [CommonService, PlatformIntegrationService, DictionaryService, ],
  selector: 'app-device-configuration-form',
  templateUrl: './device-profile-form.component.html',
})
export class DeviceProfileFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  mqttIntegration: any = new MqttIntegrationModel();
  deviceTypes: any = new DeviceProfileModel();
  @Output() allClose = new EventEmitter<any>();
  @ViewChild('deviceDrawer') public deviceDrawer!: MatSidenav;
  blankDataS!: boolean;
  public qosType = QOS_TYPE;
  deviceListError = [];
  submit = "Submit successfully";
  isEdit!: boolean;
  UIDICTIONARY : any;
  deviceTypesHide!:boolean;
  profileTypes=DEVICE_PROFILE_TYPE;
  deviceTransportTypes=DEVICE_TRANSPORT_TYPE;
  deviceProfileProvisionTypes=DEVICE_PROFILE_PROVISION_TYPE;

  constructor(private platformIntegrationService: PlatformIntegrationService,
              private commonService: CommonService,
              public dictionaryService: DictionaryService,) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });

  }


  updateDeviceList() {
    this.subs.add(this.platformIntegrationService.updateDeviceProfile(this.deviceTypes).subscribe(data => {
      this.mqttIntegration = data;
      this.commonService.notification(this.submit);
      this.allClose.emit(data);
    }));
  }

  saveDeviceList(key: any) {
    this.subs.add(this.platformIntegrationService.saveDeviceProfile(this.deviceTypes).subscribe(data => {
      this.deviceTypes = data;
      this.commonService.notification(this.submit);
      this.allClose.emit(data);
    }));
  }


  getDeviceListByKey(getData: any) {
    this.isEdit = false;
    this.deviceTypes = getData;
  }

  getDeviceList(value: any) {
      this.blankDataS = false;
      this.isEdit = false;
      this.deviceTypes = value;
      this.deviceTypesHide = true;
  }

  addNewMain(event: any) {
    this.isEdit = true;
    this.deviceTypes= new DeviceTypeModel();
    this.deviceTypesHide = false;
  }

}
