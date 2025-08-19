import {Component, OnInit} from '@angular/core';
import {BandSettingsModel} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module/mat-module.module';

@Component({
  standalone: true,
  providers: [ProfileService, DictionaryService],
  imports: [CommonModule, MatModuleModule],
  selector: 'app-band-settings',
  templateUrl: './band-settings.component.html',
  styleUrls: []
})
export class BandSettingsComponent implements OnInit {

  noMotionValue = 0;
  motionValue = 0;
  bandSettings = {} as BandSettingsModel;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService, public dictionaryService: DictionaryService) {
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
        });
  }

  setBandModel(bandSettings: BandSettingsModel) {
    if (bandSettings) {
      this.bandSettings = bandSettings;
      this.noMotionValue = this.bandSettings.noMotionValue;
      this.motionValue = this.bandSettings.motionValue;
    }
  }

  setBandToProfileService() {
    this.bandSettings.settingsType = 'BAND_SETTINGS';
    this.bandSettings.noMotionValue = this.noMotionValue;
    this.bandSettings.motionValue = this.motionValue;
    this.bandSettings.enable = true;
    this.profileService.setBandSettingModel(this.bandSettings);
  }
}
