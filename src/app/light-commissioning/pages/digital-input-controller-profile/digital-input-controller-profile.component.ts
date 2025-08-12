import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {
  DigitalControllerProfile,
  DigitalControllerProfileModel,
  GpioSettingsModel,
  GradeSettingsMap,
  GradeSettingsMapModel,
  NodeSettingsModel
} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {FormControl, Validators} from '@angular/forms';
import {GpioSettingsComponent} from '../../components';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {IntStringPairModel} from '../../../core/models';
import {JsonDataService} from '../../../core/services';
import {Common} from '../../shared';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-led-controller-profile',
  templateUrl: './digital-input-controller-profile.component.html',
  styleUrls: []
})
export class DigitalInputControllerProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  text = '';
  readPermission = [];
  editPermission = [];
  permissions = [];
  isChecked = false;
  isGpioEnabled = false;
  digitalControllerProfile = {} as DigitalControllerProfileModel;
  jsonData = {} as DigitalControllerProfile;
  nodeSettings = {} as NodeSettingsModel;
  gpioSettings = {} as GpioSettingsModel;
  gradeSettingsMap = {} as GradeSettingsMapModel[];
  gradeJsonData = {} as GradeSettingsMap;
  siteNameMapping: IntStringPairModel[];
  buildingNameMapping: IntStringPairModel[];
  floorNameMapping: IntStringPairModel[];
  roomNameMapping: IntStringPairModel[];
  zoneNameMapping: IntStringPairModel[];
  groupNameMapping: IntStringPairModel[];
  isEdit: boolean;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  public UIDICTIONARY:any;
  public digitalControllerTitle: boolean= false;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  @ViewChild(GpioSettingsComponent) gpioSettingsComponent: GpioSettingsComponent;
  inputFormControl = new FormControl('', [
    Validators.required,
  ]);
  diControllerProfileError: any = [];
  public messageError: boolean;

  constructor(
    private commonService: CommonService,
    public dictionaryService: DictionaryService,
    private profileService: ProfileService,
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

  getProfile(profileXid: any) {
    this.isEdit = true;
    this.subs.add(this.profileService.getProfileByXid(profileXid).subscribe(data => {
      this.digitalControllerProfile = data;
      this.nodeSettings = this.digitalControllerProfile.jsonData.nodeSettings;
      if (this.digitalControllerProfile.jsonData.gpioSettingsEnabled) {
        this.isGpioEnabled = this.digitalControllerProfile.jsonData.gpioSettingsEnabled;
        this.gpioSettingsComponent.setGpioSettingsModel(this.digitalControllerProfile.jsonData.gpioSettings);
      }
      this.displayPermissions();
    }, err => console.log(err)));

    this.digitalControllerTitle = true;
  }

  getPermissions() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  displayPermissions() {
    this.readPermission = [];
    this.editPermission = [];
    this.readPermission = this.digitalControllerProfile.readPermissions.split(',');
    this.editPermission = this.digitalControllerProfile.editPermissions.split(',');
  }

  saveProfile() {
    this.digitalControllerProfile.readPermissions = this.readPermission.toString();
    this.digitalControllerProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'DIGITAL_INPUT_CONTROLLER.PROFILE';
    this.nodeSettings.settingsType = 'NODE_SETTINGS';
    this.nodeSettings.type = Common.nodeTypes.get('Normal Node');
    this.jsonData.nodeSettings = this.nodeSettings;
    if (this.isGpioEnabled) {
      this.jsonData.gpioSettingsEnabled = this.isGpioEnabled;
      this.gpioSettingsComponent.setGpioSettingsToProfile();
      this.jsonData.gpioSettings = this.profileService.gpioModel;
    }
    this.digitalControllerProfile.jsonData = this.jsonData;

    this.subs.add(this.profileService.saveProfile(this.digitalControllerProfile).subscribe(data => {
      this.isEdit = true;
      this.profileService.setSaveProfile(data);
      this.commonService.notification(this.digitalControllerProfile.name + ' ' + this.saveSuccessMsg);
      this.notifyParent.emit(data);
    }, error => {
      this.diControllerProfileError = error.result.message;
      this.timeOutFunction();
    }));
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  updateProfile() {
    this.digitalControllerProfile.readPermissions = this.readPermission.toString();
    this.digitalControllerProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'DIGITAL_INPUT_CONTROLLER.PROFILE';
    this.nodeSettings.settingsType = 'NODE_SETTINGS';
    this.nodeSettings.type = Common.nodeTypes.get('Normal Node');
    this.jsonData.nodeSettings = this.nodeSettings;
    if (this.isGpioEnabled) {
      this.jsonData.gpioSettingsEnabled = this.isGpioEnabled;
      this.gpioSettingsComponent.setGpioSettingsToProfile();
      this.gpioSettings.enable = this.isGpioEnabled;
      this.jsonData.gpioSettings = this.profileService.gpioModel;
    } else {
      this.jsonData.gpioSettingsEnabled = this.isGpioEnabled;
      this.jsonData.gpioSettings = null;
    }
    this.digitalControllerProfile.jsonData = this.jsonData;

    this.subs.add(this.profileService.updateProfile(this.digitalControllerProfile).subscribe(data => {
      this.commonService.notification(this.digitalControllerProfile.name + ' ' + this.updateSuccessMsg);
      this.profileService.setUpdateProfile(data);
      this.notifyParent.emit(data);
    }, error => {
      this.diControllerProfileError = error.result.message;
      this.timeOutFunction();
    }));
  }

  enableGpio(event) {
    this.isGpioEnabled = event.checked;
    if (this.isEdit) {
      this.gpioSettingsComponent.setGpioSettingsModel(this.digitalControllerProfile.jsonData.gpioSettings);
    }
  }
}
