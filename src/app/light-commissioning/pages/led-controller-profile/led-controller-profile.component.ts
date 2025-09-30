import {Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {DictionaryService} from "../../../core/services";
import {
  BandSettingsModel,
  ControllerProfile,
  ControllerProfileModel,
  GradeSettingsMap,
  GradeSettingsMapModel,
  LuxSettingsModel,
  NodeSettingsModel,
  PirSettingsModel,
  SwitchSettingsModel,
  RetransmissionSettingsModel
} from '../../shared/model';
import {ProfileService} from '../../shared/service';

import {
  BandSettingsComponent,
  HoldTimeOneComponent,
  HoldTimeTwoComponent,
  LuxFormComponent,
  PirFormComponent,
  SwitchFormComponent,
  RetransmissionpSettingsComponent
} from '../../components';
import {FormControl, Validators} from '@angular/forms';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {IntStringPairModel} from '../../../core/models';
import {JsonDataService} from '../../../core/services';
import {CURVE_DIM_TYPE} from "../../shared";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, BandSettingsComponent, HoldTimeOneComponent, HoldTimeTwoComponent, LuxFormComponent, PirFormComponent, SwitchFormComponent, RetransmissionpSettingsComponent],
  providers: [ProfileService, DictionaryService, JsonDataService],
  selector: 'app-profile-form',
  templateUrl: './led-controller-profile.component.html',
  styleUrls: []
})
export class LedControllerProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  readPermission: any = [];
  editPermission: any = [];
  permissions: any = [];
  isChecked = false;
  isCheckedLux = false;
  isCheckedSwitch = false;
  isEnoceanRelay = false;
  isCheckedBand = false;
  isEnableHoldTimeOne = false;
  isEnableHoldTimeTwo = false;
  controllerProfile = {} as ControllerProfileModel;
  jsonData: any = {} as ControllerProfile;
  nodeSettings: any = {} as NodeSettingsModel;
  pirSettings: any = {} as PirSettingsModel;
  luxSettings: any = {} as LuxSettingsModel;
  switchSettings: any = {} as SwitchSettingsModel;
  bandSettings: any = {} as BandSettingsModel;
  reTransmissionSettings: any = {} as RetransmissionSettingsModel;
  gradeSettingsMap: any = {} as GradeSettingsMapModel[];
  gradeJsonData: any = {} as GradeSettingsMap;
  siteNameMapping?: IntStringPairModel[];
  buildingNameMapping?: IntStringPairModel[];
  floorNameMapping?: IntStringPairModel[];
  roomNameMapping?: IntStringPairModel[];
  zoneNameMapping?: IntStringPairModel[];
  groupNameMapping?: IntStringPairModel[];
  isEdit?: boolean;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  public UIDICTIONARY:any;
  ledControllerProfileError: any = [];
  nodeTypes = new Map<string, number>()
    .set('Normal Node', 0)
    .set('Enocean Relay', 1)
    .set('Sink Node', 2);
  nodeTypesArray = Array.from(this.nodeTypes.entries());
  curveDimTimeType = CURVE_DIM_TYPE;
  isThresholdMaxAndMin: boolean = false;

  @ViewChild(PirFormComponent) pirFormComponent!: PirFormComponent;
  @ViewChild(HoldTimeOneComponent) holdTimeOneComponent!: HoldTimeOneComponent;
  @ViewChild(HoldTimeTwoComponent) holdTimeTwoComponent!: HoldTimeTwoComponent;
  @ViewChild(LuxFormComponent) luxFormComponent!: LuxFormComponent;
  @ViewChild(SwitchFormComponent) switchFormComponent!: SwitchFormComponent;
  @ViewChild(RetransmissionpSettingsComponent) retransmissionSettingsComponent? : RetransmissionpSettingsComponent;
  @Output() closeAllSidebar = new EventEmitter<any>();
  @ViewChild(BandSettingsComponent) bandSettingsComponent!: BandSettingsComponent;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  public messageError?: boolean;
  public hideProfileTitle:boolean=false;
  @Output() dataSaved = new EventEmitter<any>();


  constructor(
    private commonService: CommonService,
    private profileService: ProfileService,
    public dictionaryService: DictionaryService,
    private jsonDataService: JsonDataService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getPermissions();
    this.getGradeMappingSetting();
    console.log("profile xid",this.profileService);
  }



  getGradeMappingSetting() {
    this.subs.add(this.jsonDataService.getJsonData('definition=GRADE.MAPPING').subscribe(data => {
      this.gradeSettingsMap    = data['items'];
      this.gradeJsonData       = this.gradeSettingsMap[0].jsonData;
      this.siteNameMapping     = this.gradeSettingsMap[0].jsonData.siteNameMapping;
      this.buildingNameMapping = this.gradeSettingsMap[0].jsonData.buildingNameMapping;
      this.floorNameMapping    = this.gradeSettingsMap[0].jsonData.floorNameMapping;
      this.roomNameMapping     = this.gradeSettingsMap[0].jsonData.roomNameMapping;
      this.zoneNameMapping     = this.gradeSettingsMap[0].jsonData.zoneNameMapping;
      this.groupNameMapping    = this.gradeSettingsMap[0].jsonData.groupNameMapping;

    }));
  }

  getPermissions() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  getProfile(profileXid: any) {
    console.log("get Led controller", profileXid);
    this.isEdit = true;
    this.subs.add(this.profileService.getProfileByXid(profileXid).subscribe(data => {
      this.controllerProfile = data;
      this.nodeSettings = this.controllerProfile.jsonData.nodeSettings;
      this.switchSettings = this.controllerProfile.jsonData.switchSettings;
      if (this.controllerProfile.jsonData.nodeSettings.enableHoldTimeOne) {
        this.isEnableHoldTimeOne = this.controllerProfile.jsonData.nodeSettings.enableHoldTimeOne;
        this.holdTimeOneComponent.setHoldTimeOne(this.controllerProfile.jsonData.nodeSettings);
      }
      console.log("this.controllerProfile.jsonData.retransmissionSettings",this.controllerProfile.jsonData.retransmissionSettings);
      if(this.retransmissionSettingsComponent){
       this.retransmissionSettingsComponent.setRetransmissionModel(this.controllerProfile.jsonData.retransmissionSettings);
      }
      if (this.controllerProfile.jsonData.nodeSettings.enableHoldTimeTwo) {
        this.isEnableHoldTimeTwo = this.controllerProfile.jsonData.nodeSettings.enableHoldTimeTwo;
        this.holdTimeTwoComponent.setHoldTimeTwo(this.controllerProfile.jsonData.nodeSettings);
      }
      if (this.controllerProfile.jsonData.pirSettingsEnabled) {
        this.isChecked = this.controllerProfile.jsonData.pirSettingsEnabled;
        this.pirFormComponent.setPirModel(this.controllerProfile.jsonData.pirSettings);
      }
      if (this.controllerProfile.jsonData.luxSettingsEnabled) {
        this.isCheckedLux = this.controllerProfile.jsonData.luxSettingsEnabled;
        this.luxFormComponent.setLuxModel(this.controllerProfile.jsonData.luxSettings);
      }
      if (this.controllerProfile.jsonData.nodeSettings.type === this.nodeTypes.get('Enocean Relay')) {
        this.isEnoceanRelay = true;
        this.luxFormComponent.enableAddressField(true);
        this.isCheckedSwitch = this.controllerProfile.jsonData.enoceanSwitchEnabled;

        this.switchFormComponent.setSwitchModel(this.controllerProfile.jsonData.switchSettings);
      }
      if (this.controllerProfile.jsonData.bandSettingsEnabled) {
        this.isCheckedBand = this.controllerProfile.jsonData.bandSettingsEnabled;
        this.bandSettingsComponent.setBandModel(this.controllerProfile.jsonData.bandSettings);
      }
      this.displayPermissions();
    }, err => console.log(err)));
   this.hideProfileTitle = true;
  }

  displayPermissions() {
    this.readPermission = [];
    this.editPermission = [];
    this.readPermission = this.controllerProfile.readPermissions.split(',');
    this.editPermission = this.controllerProfile.editPermissions.split(',');
  }

  saveProfile() {
    this.controllerProfile.readPermissions = this.readPermission.toString();
    this.controllerProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'LIGHT_CONTROLLER.PROFILE';
    this.nodeSettings.settingsType = 'NODE_SETTINGS';
    if (this.nodeSettings.type !== this.nodeTypes.get('Enocean Relay')) {
      this.jsonData.switchSettings = null;
    }
    if(this.retransmissionSettingsComponent){
      this.retransmissionSettingsComponent.setRetransmissionToProfileService();
      this.jsonData.retransmissionSettings = this.profileService.retransmissionSettings;
    }
    if (this.isEnableHoldTimeOne) {
      this.holdTimeOneComponent.setHoldTimeOneToProfileService();
      this.nodeSettings.enableHoldTimeOne = this.profileService.nodeSettings.enableHoldTimeOne;
      this.nodeSettings.dimValueOne       = this.profileService.nodeSettings.dimValueOne;
      this.nodeSettings.holdTimeOne       = this.profileService.nodeSettings.holdTimeOne;
      this.luxSettings.enable             = false;
      this.jsonData.luxSettings           = null;
    }
    if (this.isEnableHoldTimeTwo) {
      this.holdTimeTwoComponent.setHoldTimeTwoToProfileService();
      this.nodeSettings.enableHoldTimeTwo = this.profileService.nodeSettings.enableHoldTimeTwo;
      this.nodeSettings.dimValueTwo       = this.profileService.nodeSettings.dimValueTwo;
      this.nodeSettings.holdTimeTwo       = this.profileService.nodeSettings.holdTimeTwo;
    }
    if (this.isChecked) {
      this.jsonData.pirSettingsEnabled = this.isChecked;
      this.pirFormComponent.setPirToProfileService();
      this.pirSettings.enable          = this.isChecked;
      this.jsonData.pirSettings        = this.profileService.pirModel;
    }
    if (this.isCheckedLux) {
      this.jsonData.luxSettingsEnabled = this.isCheckedLux;
      this.luxFormComponent.setLuxToProfileService();
      this.luxSettings.enable          = this.isChecked;
      this.jsonData.luxSettings        = this.profileService.luxModel;
    }

    if (this.isCheckedSwitch) {
      this.jsonData.enoceanSwitchEnabled = this.isCheckedSwitch;
      this.switchFormComponent.setSwitchToProfileService();
      if (this.profileService.switchModel.switchData.length === 0) {
        this.jsonData.enoceanSwitchEnabled = false;
        this.jsonData.switchSettings = null;
      } else {
        this.jsonData.switchSettings = this.profileService.switchModel;
      }
    }
    if (this.isCheckedBand) {
      this.jsonData.bandSettingsEnabled = this.isCheckedBand;
      this.bandSettingsComponent.setBandToProfileService();
      this.jsonData.bandSettings = this.profileService.bandModel;
    }
    this.jsonData.nodeSettings = this.nodeSettings;
    this.controllerProfile.jsonData = this.jsonData;

    this.subs.add(this.profileService.saveProfile(this.controllerProfile).subscribe(data => {
      this.isEdit = true;
      this.dataSaved.emit(data);
      this.profileService.setSaveProfile(data);
      this.commonService.notification(this.controllerProfile.name + ' ' + this.saveSuccessMsg);
      this.notifyParent.emit(data);
      this.dataSaved.emit(data);
      this.closeAllSidebar.emit(this.closeAllSidebar);

    }, error => {
      this.ledControllerProfileError = error.result.message;
      this.timeOutFunction();
    }))
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  updateProfile() {
    this.controllerProfile.readPermissions = this.readPermission.toString();
    this.controllerProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'LIGHT_CONTROLLER.PROFILE';
    this.nodeSettings.settingsType = 'NODE_SETTINGS';
    if (this.nodeSettings.type === this.nodeTypes.get('Enocean Relay')) {
      if (this.isCheckedSwitch) {
        this.jsonData.enoceanSwitchEnabled = this.isCheckedSwitch;
        this.switchFormComponent.setSwitchToProfileService();
        if (this.profileService.switchModel.switchData.length === 0) {
          this.jsonData.enoceanSwitchEnabled = false;
          this.jsonData.switchSettings = null;
        } else {
          this.jsonData.switchSettings = this.profileService.switchModel;
        }
      } else {
        this.jsonData.enoceanSwitchEnabled = this.isCheckedSwitch;
        this.jsonData.switchSettings = null;
      }
    } else {
      this.jsonData.enoceanSwitchEnabled = false;
      this.jsonData.switchSettings = null;
    }
    if (this.isEnableHoldTimeOne) {
      this.holdTimeOneComponent.setHoldTimeOneToProfileService();
      this.nodeSettings.enableHoldTimeOne = this.profileService.nodeSettings.enableHoldTimeOne;
      this.nodeSettings.dimValueOne = this.profileService.nodeSettings.dimValueOne;
      this.nodeSettings.holdTimeOne = this.profileService.nodeSettings.holdTimeOne;
      this.luxSettings.enable = false;
      this.jsonData.luxSettings = null;
    } else {
      this.nodeSettings.enableHoldTimeOne = this.isEnableHoldTimeOne;
      this.nodeSettings.dimValueOne = 0;
      this.nodeSettings.holdTimeOne = 0;
      this.isEnableHoldTimeTwo = false;
    }

    if(this.retransmissionSettingsComponent){
      this.retransmissionSettingsComponent.setRetransmissionToProfileService();
      this.jsonData.retransmissionSettings = this.profileService.retransmissionSettings;
    }

    if (this.isEnableHoldTimeTwo) {
      this.holdTimeTwoComponent.setHoldTimeTwoToProfileService();
      this.nodeSettings.enableHoldTimeTwo = this.profileService.nodeSettings.enableHoldTimeTwo;
      this.nodeSettings.dimValueTwo = this.profileService.nodeSettings.dimValueTwo;
      this.nodeSettings.holdTimeTwo = this.profileService.nodeSettings.holdTimeTwo;
    } else {
      this.nodeSettings.enableHoldTimeTwo = this.isEnableHoldTimeTwo;
      this.nodeSettings.dimValueTwo = 0;
      this.nodeSettings.holdTimeTwo = 0;
    }

    if (this.isChecked) {
      this.jsonData.pirSettingsEnabled = this.isChecked;
      this.pirFormComponent.setPirToProfileService();
      this.pirSettings.enable = this.isChecked;
      this.jsonData.pirSettings = this.profileService.pirModel;
    } else {
      this.jsonData.pirSettingsEnabled = this.isChecked;
      this.jsonData.pirSettings = null;
    }
    if (this.isCheckedLux) {
      this.jsonData.luxSettingsEnabled = this.isCheckedLux;
      this.luxFormComponent.setLuxToProfileService();
      this.luxSettings.enable = this.isChecked;
      this.jsonData.luxSettings = this.profileService.luxModel;
    } else {
      this.jsonData.luxSettingsEnabled = this.isCheckedLux;
      this.jsonData.luxSettings = null;
    }
    if (this.isCheckedBand) {
      this.jsonData.bandSettingsEnabled = this.isCheckedBand;
      this.bandSettingsComponent.setBandToProfileService();
      this.bandSettings.enable = this.isCheckedBand;
      this.jsonData.bandSettings = this.profileService.bandModel;
    } else {
      this.jsonData.bandSettingsEnabled = this.isCheckedBand;
      this.jsonData.bandSettings = null;
    }
    this.jsonData.nodeSettings = this.nodeSettings;
    this.controllerProfile.jsonData = this.jsonData;

    this.subs.add(this.profileService.updateProfile(this.controllerProfile).subscribe(data => {
      this.commonService.notification(this.controllerProfile.name + ' ' + this.updateSuccessMsg);
      this.profileService.setUpdateProfile(data);
      this.notifyParent.emit(data);
      this.closeAllSidebar.emit(this.closeAllSidebar);
    }, error => {
      this.ledControllerProfileError = error.result.message;
      this.timeOutFunction();
    }))
  }

  enableLux(event: any) {
    this.isCheckedLux = event.checked;
    if (this.isEdit) {
      this.luxFormComponent.setLuxModel(this.controllerProfile.jsonData.luxSettings);
    }
  }

  enablePir(event: any) {
    this.isChecked = event.checked;
    if (this.isEdit) {
      this.pirFormComponent.setPirModel(this.controllerProfile.jsonData.pirSettings);
    }
  }

  enableHoldTimeOne(event: any) {
    this.isEnableHoldTimeOne = event.checked;
    if (this.isEdit) {
      this.holdTimeOneComponent.setHoldTimeOne(this.controllerProfile.jsonData.nodeSettings);
    }
  }

  enableHoldTimeTwo(event: any) {
    this.isEnableHoldTimeTwo = event.checked;
    if (this.isEdit) {
      this.holdTimeTwoComponent.setHoldTimeTwo(this.controllerProfile.jsonData.nodeSettings);
    }
  }

  enableSwitch(event: any) {
    this.isCheckedSwitch = event.checked;
    if (this.isEdit) {
      this.switchFormComponent.setSwitchModel(this.controllerProfile.jsonData.switchSettings);
    }
  }

  enableBand(event: any) {
    this.isCheckedBand = event.checked;
    if (this.isEdit) {
      this.bandSettingsComponent.setBandModel(this.controllerProfile.jsonData.bandSettings);
    }
  }

  enoceanRelay(event: any) {
    this.isEnoceanRelay = (event.value === this.nodeTypes.get('Enocean Relay'));
    this.luxFormComponent.enableAddressField(this.isEnoceanRelay);
  }

  enableThresholdMaxAndMin(event: boolean) {
    this.isThresholdMaxAndMin = event;
  }
}
