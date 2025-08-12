import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  Output,
  ViewContainerRef,
  EventEmitter
} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {ProfilePushSettingsModel} from '../../shared/model';
import {SystemSettingService} from '../../../core/services';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-profilepushsystem',
  templateUrl: './profilepushsystem.component.html'
})
export class ProfilepushsystemComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  hideShowDiv:boolean;
  _profilePush:any = new ProfilePushSettingsModel();
  save = "push successfully";
  @Output() closeSidebar = new EventEmitter<any>();
  public UIDICTIONARY:any;

  constructor(private commonService: CommonService,
              private _systemSetting: SystemSettingService,
              public dictionaryService:DictionaryService )
  {
    super();
  }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this._getProfilePush();
  }


  enableInputs(checked){
    checked===true?this.hideShowDiv=true:this.hideShowDiv=false;

  }

  _profilePushSave(){
    this.add(this._systemSetting.saveSystemSettings(this._profilePush).subscribe(data=>{
     this.commonService.notification(this.save);
     this.closeSidebar.emit(data);
    }))
  }
  _getProfilePush() {
    this.add(
      this._systemSetting.getSystemSettings().subscribe(data => {
        const profilePushProps = [
          'lightCommissioningProfilePushEnabled',
          'lightCommissioningProfilePushHoldTime',
          'lightCommissioningProfilePushScheduleHour',
          'lightCommissioningProfilePushScheduleSec',
          'lightCommissioningProfilePushScheduleMin',
          'lightCommissioningProfilePushScheduleAfterExecute',
          'lightCommissioningProfilePushScheduleSleepTimeRetryRun',
          'lightCommissioningProfilePushScheduleSleepTimeFirstRun',
          'lightCommissioningProfilePushNodesFilter',
          'lightCommissioningProfilePushToDownNodes',
          'lightCommissioningProfilePushScheduleRuntimeStats'
        ];
        profilePushProps.forEach(prop => this._profilePush[prop] = data[prop]);
        this.hideShowDiv = this._profilePush.lightCommissioningProfilePushEnabled;
      })
    );
  }

}
