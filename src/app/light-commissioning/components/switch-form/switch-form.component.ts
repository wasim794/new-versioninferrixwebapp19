import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';
import {SwitchSettingsModel, SwitchDataModel} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {grade_Types} from '../../../common/static-data/static-data';

@Component({
  selector: 'app-switch-form',
  templateUrl: './switch-form.component.html',
  styleUrls: []
})
export class SwitchFormComponent implements OnInit {
  switchSettings = {} as SwitchSettingsModel;
  switchDataModels: SwitchDataModel[];
  SwitchData = {} as SwitchDataModel;
  public form: FormGroup;
  public switchList: FormArray;
  gradeTypes = grade_Types;
  public UIDICTIONARY:any;

  constructor(
    private fb: FormBuilder, public dictionaryService: DictionaryService,
    private profileService: ProfileService) {
    this.form = this.fb.group({
      switchSetting: this.fb.array([this.createSwitch()])
    });
    // set switchList to the form control containing contacts
    this.switchList = this.form.get('switchSetting') as FormArray;
  }

  get switchFormGroup() {
    return this.form.get('switchSetting') as FormArray;
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  // add a switch form group
  addSwitch() {
    if (this.switchList.length < 6) {
      this.switchList.push(this.createSwitch());
    } else {
      alert('Maxmium 6 switches can be added!');
    }
  }

  // remove switch from group
  removeSwitch(index) {
    this.switchList.removeAt(index);
  }

  createSwitch(): FormGroup {
    return this.fb.group({
      name: [null],
      gradeType: [null],
      address: [null],
      enable: [true],
    });
  }

  setSwitchToProfileService() {
    this.switchSettings.settingsType = 'SWITCH_SETTINGS';
    if (this.form.value.switchSetting) {
      this.switchDataModels = this.form.value.switchSetting;
      this.switchSettings.switchData = this.switchDataModels;
    }
    this.profileService.setSwitchSettingModel(this.switchSettings);
  }

  setSwitchModel(switchSettings: SwitchSettingsModel) {
    if (switchSettings) {
      this.switchSettings = switchSettings;
      if (switchSettings.switchData.length) {
        while (this.switchList.length !== 0) {
          this.switchList.removeAt(0);
        }
        switchSettings.switchData.forEach(model => {
          this.SwitchData = model;
          this.switchList.push(this.setSwitch());
        });
      }
    }
  }

  setSwitch(): FormGroup {
    return this.fb.group({
      address: [this.SwitchData.address],
      gradeType: [this.SwitchData.gradeType],
      name: [this.SwitchData.name],
      enable: [this.SwitchData.enable]
    });
  }
}
