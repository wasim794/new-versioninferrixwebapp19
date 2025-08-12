import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PirSettingsModel} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {grade_Types} from '../../../common/static-data/static-data';

@Component({
  selector: 'app-pir-form',
  templateUrl: './pir-form.component.html',
  styleUrls: []
})
export class PirFormComponent implements OnInit {
  @Output() isThresholdMaxAndMin = new EventEmitter<boolean>();
  gradeTypes = grade_Types;

  pirSettings = {} as PirSettingsModel;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService, public dictionaryService: DictionaryService) {
  }

  autoTicks = false;
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  noMotionValue = 0;
  motionValue = 0;
  vertical = false;
  tickInterval = 1;

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }
    return 0;
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  setPirModel(pirSettings: PirSettingsModel) {
    if (pirSettings) {
      this.pirSettings = pirSettings;
      this.noMotionValue = this.pirSettings.noMotionValue;
      this.motionValue = this.pirSettings.motionValue;
      this.isThresholdMaxAndMin.emit(this.noMotionValue > 0);
    }
  }

  setPirToProfileService() {
    this.pirSettings.settingsType = 'PIR_SETTINGS';
    this.pirSettings.noMotionValue = this.noMotionValue;
    this.pirSettings.motionValue = this.motionValue;
    this.pirSettings.enable = true;
    this.profileService.setPirSettingModel(this.pirSettings);
  }

  noMotionChange(event: any) {
    this.isThresholdMaxAndMin.emit(event.value > 0);
  }
}
