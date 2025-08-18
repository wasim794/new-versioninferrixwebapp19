import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {WristBandProfile, WristBandProfileModel, WristBandSettingsModel} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [ProfileService, DictionaryService],
  selector: 'app-wristband',
  templateUrl: './wristband.component.html',
  styleUrls: []
})
export class WristbandComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  readPermission: any = [];
  editPermission: any = [];
  permissions = [];
  wristBandProfile = {} as WristBandProfileModel;
  jsonData = {} as WristBandProfile;
  wristBandSettings = {} as WristBandSettingsModel;
  isEdit!: boolean;
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  wristControllerProfileError: any = [];
  @Output() profileCreatorSidebar = new EventEmitter;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  public messageError!: boolean;
  public UIDICTIONARY:any;
  public wristBandProfileTitle:boolean=false;

  constructor(
    private commonService: CommonService, public dictionaryService: DictionaryService, private profileService: ProfileService) {
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

  }

  getPermissions() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  getProfile(profileXid: any) {
    this.isEdit = true;
    this.subs.add(this.profileService.getProfileByXid(profileXid).subscribe(data => {
      this.wristBandProfile = data;
      this.wristBandSettings = this.wristBandProfile.jsonData.wristBandSettings;
      this.displayPermissions();
    }, err => console.log(err)));
    this.wristBandProfileTitle = true;

  }

  displayPermissions() {
    this.readPermission = [];
    this.editPermission = [];
    this.readPermission = this.wristBandProfile.readPermissions.split(',');
    this.editPermission = this.wristBandProfile.editPermissions.split(',');
  }

  saveWristBand() {
    this.wristBandProfile.readPermissions = this.readPermission.toString();
    this.wristBandProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'WRIST_BAND.PROFILE';
    this.wristBandSettings.settingsType = 'WRIST_BAND_SETTINGS';
    this.jsonData.wristBandSettings = this.wristBandSettings;
    this.wristBandProfile.jsonData = this.jsonData;
    this.subs.add(this.profileService.saveProfile(this.wristBandProfile).subscribe(data => {
      this.isEdit = true;
      this.profileService.setSaveProfile(data);
      this.commonService.notification(this.wristBandProfile.name + ' ' + this.saveSuccessMsg);
    }, error => {
      this.wristControllerProfileError = error.result.message;
      this.timeOutFunction();
    }))
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }
  updateWristBand() {
    this.wristBandProfile.readPermissions = this.readPermission.toString();
    this.wristBandProfile.editPermissions = this.editPermission.toString();
    this.jsonData.jsonDataType = 'WRIST_BAND.PROFILE';
    this.wristBandSettings.settingsType = 'WRIST_BAND_SETTINGS';
    this.jsonData.wristBandSettings = this.wristBandSettings;
    this.wristBandProfile.jsonData = this.jsonData;

    this.subs.add(this.profileService.updateProfile(this.wristBandProfile).subscribe(data => {
      this.commonService.notification(this.wristBandProfile.name + ' ' + this.updateSuccessMsg);
      this.profileService.setUpdateProfile(data);
      this.notifyParent.emit(data);
      this.profileCreatorSidebar.emit();

    }, error => {
      this.wristControllerProfileError = error.result.message;
      this.timeOutFunction();
    }))
  }

}
