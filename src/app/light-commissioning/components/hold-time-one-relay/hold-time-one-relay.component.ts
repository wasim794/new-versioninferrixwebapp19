import {Component, OnInit} from '@angular/core';
import {NodeSettingsModel} from '../../shared/model';
import {ProfileService} from '../../shared/service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [ProfileService, DictionaryService],
  selector: 'app-hold-time-one-relay',
  templateUrl: './hold-time-one-relay.component.html',
  styleUrls: []
})
export class HoldTimeOneRelayComponent implements OnInit {
  nodeSettings = {} as NodeSettingsModel;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService, public dictionaryService: DictionaryService) {
  }

  ngOnInit() {

    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
  }

  setHoldTimeOne(node: NodeSettingsModel) {
    if (node) {
      this.nodeSettings = node;
    }
  }

  setHoldTimeOneToProfileService() {
    this.nodeSettings.enableHoldTimeOne = true;
    this.profileService.setHoldTimeOneModel(this.nodeSettings);
  }
}
