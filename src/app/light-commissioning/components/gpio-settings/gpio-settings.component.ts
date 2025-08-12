import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../../shared/service';
import {GpioSettingsModel} from '../../shared/model';
import {DictionaryService} from "../../../core/services";
import {action_Types, grade_Types} from '../../../common';


@Component({
  selector: 'app-gpio-settings',
  templateUrl: './gpio-settings.component.html',
  styleUrls: []
})
export class GpioSettingsComponent implements OnInit {

  gpioSettings = {} as GpioSettingsModel;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService, public dictionaryService: DictionaryService) {
  }

  gradeTypes = grade_Types;
  actionTypes = action_Types;

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  setGpioSettingsModel(gpioSettings: GpioSettingsModel) {
    if (gpioSettings) {
      this.gpioSettings = gpioSettings;
    }
  }

  setGpioSettingsToProfile() {
    this.gpioSettings.settingsType = 'GPIO_SETTINGS';
    this.profileService.setGpioSettingModel(this.gpioSettings);
  }
}
