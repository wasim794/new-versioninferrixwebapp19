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
  selector: 'app-hold-time-one',
  templateUrl: './hold-time-one.component.html',
  styleUrls: []
})
export class HoldTimeOneComponent implements OnInit {
  dimmingValueOne = 0;
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
      this.dimmingValueOne = this.nodeSettings.dimValueOne;
    }
  }

  setHoldTimeOneToProfileService() {
    this.nodeSettings.dimValueOne = this.dimmingValueOne;
    this.nodeSettings.enableHoldTimeOne = true;
    this.profileService.setHoldTimeOneModel(this.nodeSettings);
  }

}
