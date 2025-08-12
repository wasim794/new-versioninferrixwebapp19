import {Component, OnInit} from '@angular/core';
import {BandSettingsModel, RetransmissionSettingsModel} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-retransmissionp-settings',
  templateUrl: './retransmissionp-settings.component.html'
})
export class RetransmissionpSettingsComponent implements OnInit {
  public retransmission = {} as RetransmissionSettingsModel;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService,
              public dictionaryService: DictionaryService) {
  }

  ngOnInit(): void {
      this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  setRetransmissionModel(model: RetransmissionSettingsModel) {
    if (model) {
      this.retransmission = model;
    }
  }

  setRetransmissionToProfileService() {
    this.retransmission.settingsType = 'RETRANSMISSION_SETTINGS';
    this.profileService.setRetransmissionModel(this.retransmission)
  }

}
