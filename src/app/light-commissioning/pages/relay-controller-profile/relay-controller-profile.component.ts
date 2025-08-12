import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DictionaryService} from "../../../core/services";
import {
  BandSettingsModel,
  GradeSettingsMap,
  GradeSettingsMapModel,
  LuxSettingsModel,
  NodeSettingsModel,
  PirSettingsModel,
  SwitchSettingsModel
} from '../../shared/model';
import {IntStringPairModel} from '../../../core/models';
import {
  BandSettingsComponent,
  HoldTimeOneRelayComponent,
  HoldTimeTwoComponent,
  LuxFormComponent,
  PirFormComponent,
  SwitchFormComponent
} from '../../components';
import {FormControl, Validators} from '@angular/forms';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {CommonService} from '../../../services/common.service';
import {ProfileService} from '../../shared/service';
import {JsonDataService} from '../../../core/services';
import {RelayControllerProfileModel} from '../../shared/model/relay-controller-profile.model';
import {RelayControllerProfile} from '../../shared/model/relay-controller-profile';

@Component({
  selector: 'app-relay-controller-profile',
  templateUrl: './relay-controller-profile.component.html',
  styleUrls: []
})
export class RelayControllerProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  readPermission = [];
  editPermission = [];
  permissions = [];
  isChecked = false;
  isCheckedLux = false;
  isCheckedSwitch = false;
  isEnoceanRelay = false;
  isCheckedBand = false;
  isEnableHoldTimeOne = false;
  isEnableHoldTimeTwo = false;
  isDisplayLux = false;
  relayControllerProfile = {} as RelayControllerProfileModel;
  jsonData = {} as RelayControllerProfile;
  nodeSettings = {} as NodeSettingsModel;
  pirSettings = {} as PirSettingsModel;
  luxSettings = {} as LuxSettingsModel;
  switchSettings = {} as SwitchSettingsModel;
  bandSettings = {} as BandSettingsModel;
  gradeSettingsMap = {} as GradeSettingsMapModel[];
  gradeJsonData = {} as GradeSettingsMap;
  siteNameMapping: IntStringPairModel[];
  buildingNameMapping: IntStringPairModel[];
  floorNameMapping: IntStringPairModel[];
  roomNameMapping: IntStringPairModel[];
  zoneNameMapping: IntStringPairModel[];
  groupNameMapping: IntStringPairModel[];
  public messageError: boolean;
  isEdit: boolean;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  UIDICTIONARY:any;
  public relayControllerProfileTitle: boolean =false;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  relayControllerProfileError: any = [];
  nodeTypes = new Map()
    .set('Normal Node', 0)
    .set('Enocean Relay', 1)
    .set('Sink Node', 2);

  @ViewChild(PirFormComponent) pirFormComponent: PirFormComponent;
  @ViewChild(HoldTimeOneRelayComponent) holdTimeOneRelayComponent: HoldTimeOneRelayComponent;
  @ViewChild(HoldTimeTwoComponent) holdTimeTwoComponent: HoldTimeTwoComponent;
  @ViewChild(LuxFormComponent) luxFormComponent: LuxFormComponent;
  @ViewChild(SwitchFormComponent) switchFormComponent: SwitchFormComponent;
  @ViewChild(BandSettingsComponent) bandSettingsComponent: BandSettingsComponent;
  inputFormControl = new FormControl('', [
    Validators.required,
  ]);


  constructor(private commonService: CommonService,
              private profileService: ProfileService,
              public dictionaryService: DictionaryService,
              private jsonDataService: JsonDataService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    if (this.profileService.profileXid) {
      this.getProfile(this.profileService.profileXid);
    }
    this.getPermissions();
    this.getGradeMappingSetting();

  }

  get getNodeTypes() {
    return Array.from(this.nodeTypes.keys());
  }

  getGradeMappingSetting() {
    this.subs.add(this.jsonDataService.getJsonData('definition=GRADE.MAPPING').subscribe(data => {
      this.gradeSettingsMap = data['items'];
      this.gradeJsonData = this.gradeSettingsMap[0].jsonData;
      this.siteNameMapping = this.gradeSettingsMap[0].jsonData.siteNameMapping;
      this.buildingNameMapping = this.gradeSettingsMap[0].jsonData.buildingNameMapping;
      this.floorNameMapping = this.gradeSettingsMap[0].jsonData.floorNameMapping;
      this.roomNameMapping = this.gradeSettingsMap[0].jsonData.roomNameMapping;
      this.zoneNameMapping = this.gradeSettingsMap[0].jsonData.zoneNameMapping;
      this.groupNameMapping = this.gradeSettingsMap[0].jsonData.groupNameMapping;
    }));
  }

  getPermissions() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  getProfile(profileXid: any) {
    this.isEdit = true;
    this.subs.add(this.profileService.getProfileByXid(profileXid).subscribe(data => {
      this.relayControllerProfile = data;
      this.nodeSettings = this.relayControllerProfile.jsonData.nodeSettings;
      this.switchSettings = this.relayControllerProfile.jsonData.switchSettings;
      if (this.relayControllerProfile.jsonData.nodeSettings.enableHoldTimeOne) {
        this.luxFormComponent.enableHoldTimeOne(this.relayControllerProfile.jsonData.nodeSettings.enableHoldTimeOne);
        this.isDisplayLux = this.relayControllerProfile.jsonData.nodeSettings.enableHoldTimeOne;
        this.isEnableHoldTimeOne = this.relayControllerProfile.jsonData.nodeSettings.enableHoldTimeOne;
        this.holdTimeOneRelayComponent.setHoldTimeOne(this.relayControllerProfile.jsonData.nodeSettings);
      } else {
        this.luxFormComponent.enableHoldTimeOne(this.relayControllerProfile.jsonData.nodeSettings.enableHoldTimeOne);
        this.isDisplayLux = false;
      }
      if (this.relayControllerProfile.jsonData.nodeSettings.enableHoldTimeTwo) {
        this.isEnableHoldTimeTwo = this.relayControllerProfile.jsonData.nodeSettings.enableHoldTimeTwo;
        this.holdTimeTwoComponent.setHoldTimeTwo(this.relayControllerProfile.jsonData.nodeSettings);
      }
      if (this.relayControllerProfile.jsonData.pirSettingsEnabled) {
        this.isChecked = this.relayControllerProfile.jsonData.pirSettingsEnabled;
        this.pirFormComponent.setPirModel(this.relayControllerProfile.jsonData.pirSettings);
      }
      if (this.relayControllerProfile.jsonData.luxSettingsEnabled) {
        this.isCheckedLux = this.relayControllerProfile.jsonData.luxSettingsEnabled;
        this.luxFormComponent.setLuxModel(this.relayControllerProfile.jsonData.luxSettings);
      }
      if (this.relayControllerProfile.jsonData.nodeSettings.type === this.nodeTypes.get('Enocean Relay')) {
        this.isEnoceanRelay = true;
        this.luxFormComponent.enableAddressField(true);
        this.isCheckedSwitch = this.relayControllerProfile.jsonData.enoceanSwitchEnabled;
        this.switchFormComponent.setSwitchModel(this.relayControllerProfile.jsonData.switchSettings);
      }
      if (this.relayControllerProfile.jsonData.bandSettingsEnabled) {
        this.isCheckedBand = this.relayControllerProfile.jsonData.bandSettingsEnabled;
        this.bandSettingsComponent.setBandModel(this.relayControllerProfile.jsonData.bandSettings);
      }
      this.displayPermissions();
    }, err => console.log(err)));
    this.relayControllerProfileTitle = true;
  }

  displayPermissions() {
    this.readPermission = [];
    this.editPermission = [];
    this.readPermission = this.relayControllerProfile.readPermissions.split(',');
    this.editPermission = this.relayControllerProfile.editPermissions.split(',');
  }

  saveProfile() {
    this.relayControllerProfile.readPermissions = this.readPermission.toString();
    this.relayControllerProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'RELAY_CONTROLLER.PROFILE';
    this.nodeSettings.settingsType = 'NODE_SETTINGS';
    this.jsonData.nodeSettings = this.nodeSettings;
    if (this.nodeSettings.type !== this.nodeTypes.get('Enocean Relay')) {
      this.jsonData.switchSettings = null;
    }
    if (this.isEnableHoldTimeOne) {
      this.holdTimeOneRelayComponent.setHoldTimeOneToProfileService();
      this.nodeSettings.enableHoldTimeOne = this.profileService.nodeSettings.enableHoldTimeOne;
      this.nodeSettings.dimValueOne = this.profileService.nodeSettings.dimValueOne;
      this.nodeSettings.holdTimeOne = this.profileService.nodeSettings.holdTimeOne;
      this.luxSettings.enable = false;
      this.jsonData.luxSettings = null;
    }
    if (this.isEnableHoldTimeTwo) {
      this.holdTimeTwoComponent.setHoldTimeTwoToProfileService();
      this.nodeSettings.enableHoldTimeTwo = this.profileService.nodeSettings.enableHoldTimeTwo;
      this.nodeSettings.dimValueTwo = this.profileService.nodeSettings.dimValueTwo;
      this.nodeSettings.holdTimeTwo = this.profileService.nodeSettings.holdTimeTwo;
    }
    if (this.isChecked) {
      this.jsonData.pirSettingsEnabled = this.isChecked;
      this.pirFormComponent.setPirToProfileService();
      this.pirSettings.enable = this.isChecked;
      this.jsonData.pirSettings = this.profileService.pirModel;
    }
    if (this.isCheckedLux) {
      this.jsonData.luxSettingsEnabled = this.isCheckedLux;
      this.luxFormComponent.setLuxToProfileService();
      this.luxSettings.enable = this.isChecked;
      this.jsonData.luxSettings = this.profileService.luxModel;
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
    this.relayControllerProfile.jsonData = this.jsonData;
    this.subs.add(this.profileService.saveProfile(this.relayControllerProfile).subscribe(data => {
      this.isEdit = true;
      this.profileService.setSaveProfile(data);
      this.commonService.notification(this.relayControllerProfile.name + ' ' + this.saveSuccessMsg);
      this.notifyParent.emit(data);
    }, error => {
      this.relayControllerProfileError = error.result.message;

      this.timeOutFunction();
    }))
  }

  updateProfile() {
    this.relayControllerProfile.readPermissions = this.readPermission.toString();
    this.relayControllerProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'RELAY_CONTROLLER.PROFILE';
    this.nodeSettings.settingsType = 'NODE_SETTINGS';
    this.jsonData.nodeSettings = this.nodeSettings;
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
      this.holdTimeOneRelayComponent.setHoldTimeOneToProfileService();
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
    this.relayControllerProfile.jsonData = this.jsonData;
    this.subs.add(this.profileService.updateProfile(this.relayControllerProfile).subscribe(data => {
      this.commonService.notification(this.relayControllerProfile.name + ' ' + this.updateSuccessMsg);
      this.profileService.setUpdateProfile(data);
      this.notifyParent.emit(data);
    }, error => {
      this.relayControllerProfileError = error.result.message;

      this.timeOutFunction();
    }))
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  enableLux(event) {
    this.isCheckedLux = event.checked;
    if (this.isEdit) {
      this.luxFormComponent.setLuxModel(this.relayControllerProfile.jsonData.luxSettings);
    }
  }

  enablePir(event) {
    this.isChecked = event.checked;
    if (this.isEdit) {
      this.pirFormComponent.setPirModel(this.relayControllerProfile.jsonData.pirSettings);
    }
  }

  enableHoldTimeOne(event) {
    this.isEnableHoldTimeOne = event.checked;
    this.luxFormComponent.enableHoldTimeOne(this.isEnableHoldTimeOne);
    this.isDisplayLux = !!event.checked;

    if (this.isEdit) {
      this.holdTimeOneRelayComponent.setHoldTimeOne(this.relayControllerProfile.jsonData.nodeSettings);
    }
  }


  enableSwitch(event) {
    this.isCheckedSwitch = event.checked;
    if (this.isEdit) {
      this.switchFormComponent.setSwitchModel(this.relayControllerProfile.jsonData.switchSettings);
    }
  }

  enableBand(event) {
    this.isCheckedBand = event.checked;
    if (this.isEdit) {
      this.bandSettingsComponent.setBandModel(this.relayControllerProfile.jsonData.bandSettings);
    }
  }

  enoceanRelay(event) {
    this.isEnoceanRelay = event.value === this.nodeTypes.get('Enocean Relay');
    this.luxFormComponent.enableAddressField(this.isEnoceanRelay && !this.isEnableHoldTimeOne);
  }

}
