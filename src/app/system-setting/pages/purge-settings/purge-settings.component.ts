import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SystemSettingService} from '../../../core/services';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {PURGE_TIME_PERIOD_TYPES} from '../../../common/static-data/static-data';
import {PurgeModel} from "../../shared";
import {CommonService} from "../../../services/common.service";
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule, PurgeSettingsComponent],
  providers: [SystemSettingService, DictionaryService, CommonService],
  selector: 'app-purge-settings',
  templateUrl: './purge-settings.component.html',
  styleUrls: []
})
export class PurgeSettingsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  saveSuccessMsg = 'Saved successfully';
  systemSettingsSavedMsg ="System settings saved.";
  private errorMsg: any;
  periodType = PURGE_TIME_PERIOD_TYPES;
  model!: PurgeModel;
  @Output() systemsettingsidebar = new EventEmitter<any>();
  UIDICTIONARY : any;

  constructor(private systemSettingService: SystemSettingService, public dictionaryService: DictionaryService,
              private commonService: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('dataPurge').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.systemSettingDetail();

  }

  private systemSettingDetail() {
    this.subs.add(this.systemSettingService.getSystemSettings().subscribe(data => {
      this.model = PurgeModel.convert(data);
    }, err => this.errorMsg = err));
  }

  public savePurgeSettings() {
    this.subs.add(this.systemSettingService.saveSystemSettings(this.model).subscribe(data => {
      this.model = PurgeModel.convert(data);
      this.commonService.notification(this.systemSettingsSavedMsg);
      this.systemsettingsidebar.emit();
    }, error => this.errorMsg = error));
  }
}
