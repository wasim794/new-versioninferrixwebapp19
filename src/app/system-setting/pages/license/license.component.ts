import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HelpModalComponent} from '../../../help/help-modal/help-modal.component';
import {commonHelp} from "../../../help/commonHelp";
import {MatDialog} from '@angular/material/dialog';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {LicenseModel, LicenseService} from '../../shared';
import {SystemSettingService} from '../../../core/services';
import {CommonService} from '../../../services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, HelpModalComponent],
  providers: [SystemSettingService, LicenseService, DictionaryService, CommonService],
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: []
})
export class LicenseComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  CheckboxVar!: boolean;
  name!: string;
  @Input() licenseModel = {} as LicenseModel;
  @Input() licenseKey!: string;
  @Output() systemsettingsidebar = new EventEmitter<any>();
  saveSuccessMsg = 'Saved successfully';
  licenseError: any = [];
  info = new commonHelp();
  private licenseHelpTitle = 'License';
  UIDICTIONARY : any;
  private durationInSeconds = 5;
  public messageError!: boolean;

  constructor(
    private systemSettingService: SystemSettingService,
    private licenseService: LicenseService,
    public dictionaryService: DictionaryService,
    private dialog: MatDialog,
    private _commonService: CommonService) {
    super();
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('core').subscribe(data=>{
   this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.getLicenseDetails();
    this.licenseService.getLicenseKey().subscribe(data => this.licenseKey = data.licenseUniqueKey);

  }

  getLicenseDetails() {
    return this.subs.add(this.systemSettingService.getSystemSettings().subscribe(data => {
      this.licenseModel.license = data.license;
      this.licenseModel.licenseeName = data.licenseeName;
      this.licenseModel.licenseeId = data.licenseeId;
    }));
  }

  loadLicenseHelpModel() {
    this.dialog.open(HelpModalComponent, {
      data: {title: 'licenseHelpTitle', content: this.info.licenseHelpContent},
      disableClose: true
    });
  }

  toggleCheckBox(Event: { checked: boolean; }) {
    this.CheckboxVar = Event.checked;
  }

  saveLicense() {
    this.updateSystemSettingInBulk(this.licenseModel);
    this.systemsettingsidebar.emit();
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  private updateSystemSettingInBulk(object: Object) {
    this.subs.add(this.systemSettingService.saveSystemSettings(object).subscribe(data => {
        this._commonService.notification(this.saveSuccessMsg);
      }, error => {
        this.licenseError = error.result.message;
      this.timeOutFunction();
      })
    );
  }
}
