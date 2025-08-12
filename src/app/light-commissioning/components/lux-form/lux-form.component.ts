import {Component, OnInit, Input} from '@angular/core';
import {LuxSettingsModel} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {grade_Types} from "../../../common/static-data/static-data";

@Component({
  selector: 'app-lux-form',
  templateUrl: './lux-form.component.html',
  styleUrls: []
})
export class LuxFormComponent implements OnInit {
  @Input() isThresholdMaxAndMin: boolean = false;
  enableAddress = false;
  isHoldTimeOne = false;
  luxSettings = {} as LuxSettingsModel;
  gradeTypes = grade_Types;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService, public dictionaryService: DictionaryService) {
  }

  ngOnInit() {

     this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  enableAddressField(enable) {
    this.enableAddress = enable;
  }

  enableHoldTimeOne(enable) {
    this.isHoldTimeOne = enable;
  }

  setLuxModel(luxSetting: LuxSettingsModel) {
    if (luxSetting) {
      this.luxSettings = luxSetting;
    }
  }

  setLuxToProfileService() {
    if (!this.enableAddress) {
      this.luxSettings.address = '';
      this.luxSettings.gradeType = 'NULL';
    }
    this.luxSettings.settingsType = 'LUX_SETTINGS';
    this.luxSettings.enable = true;
    this.profileService.setLuxSettingModel(this.luxSettings);
  }
}

