import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HelpModalComponent} from '../../../help/help-modal/help-modal.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {commonHelp} from "../../../help/commonHelp";
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {EmailConfigurationModel} from '../../shared';
import {SystemSettingService} from '../../../core/services';
import {CommonService} from '../../../services/common.service';
import {contentTypes} from '../../../common';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule],
  providers: [SystemSettingService, DictionaryService, CommonService],
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: []
})
export class EmailComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  name!: string;
  @Input() emailSetting = {} as EmailConfigurationModel;
  saveSuccessMsg = 'Saved successfully';
  showCredentialFields!: boolean;
  info = new commonHelp();
  emailError : any= [];
  contentTypes = contentTypes;
  enabledAuthorization!: boolean;
  private emailHelpTitle = 'Http';
  UIDICTIONARY : any;
  private durationInSeconds = 5;
  @Output() systemsettingsidebar = new EventEmitter<any>();
  public messageError!: boolean;

  constructor(
    private systemSettingService: SystemSettingService,
    private dialog: MatDialog,
    public dictionaryService: DictionaryService,
    private _commonService: CommonService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.getEmailConfigurationDetails();

  }

  getEmailConfigurationDetails() {
    this.subs.add(this.systemSettingService.getSystemSettings().subscribe(data => {
      this.emailSetting.emailSmtpHost = data.emailSmtpHost;
      this.emailSetting.emailSmtpPassword = data.emailSmtpPassword;
      this.emailSetting.emailSmtpPort = data.emailSmtpPort;
      this.emailSetting.emailSmtpUsername = data.emailSmtpUsername;
      this.emailSetting.emailTls = data.emailTls;
      this.emailSetting.emailAuthorization = data.emailAuthorization;
      this.emailSetting.emailContentType = data.emailContentType;
      this.emailSetting.emailFromAddress = data.emailFromAddress;
      this.emailSetting.emailFromName = data.emailFromName;
      this.emailSetting.emailSendTimeout = data.emailSendTimeout;
      this.emailSetting.emailDisabled = data.emailDisabled;
      this.reverseEnableDisabled();
      if(this.emailSetting.emailFromAddress){
        this.showCredentialFields = true;
      }else{
        this.showCredentialFields = false;
      }
    }));
  }

  loadEmailHelpModel() {
    this.dialog.open(HelpModalComponent, {
      panelClass: ['permission-overflow'],
      data: {title: 'Email Help Title', content: this.info.htmlEmailInformation},
      disableClose: true
    });
  }

  useAuthorization(Event: { checked: boolean; }) {
    this.showCredentialFields = Event.checked;
  }

  saveEmailConfiguration() {
  if(this.emailSetting.emailFromName.length === 0   || this.emailSetting.emailFromAddress.length === 0 ){
  this.timeOutFunction();
  this.emailError = [{"message": "Required value"}]
  return;
}
    this.reverseEnableDisabled();
    this.updateEmailSettings(this.emailSetting);
    this.systemsettingsidebar.emit();

  }

  private reverseEnableDisabled(){
    if(this.emailSetting.emailDisabled == true){
      this.emailSetting.emailDisabled = false;
    }else{
      this.emailSetting.emailDisabled = true;
    }
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  private updateEmailSettings(object: Object) {
    this.subs.add(this.systemSettingService.saveSystemSettings(object).subscribe(data => {

        this._commonService.notification(this.saveSuccessMsg);
      }, error => {
        this.emailError = error.result.message;
      this.timeOutFunction();
      })
    );
  }
}

