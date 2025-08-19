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
  selector: 'app-hold-time-two',
  templateUrl: './hold-time-two.component.html',
  styleUrls: []
})
export class HoldTimeTwoComponent implements OnInit {

  dimmingValueTwo = 0;
  nodeSettings = {} as NodeSettingsModel;
  public UIDICTIONARY:any;

  constructor(private profileService: ProfileService, public dictionaryService: DictionaryService) {
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });

  }

  setHoldTimeTwo(node: NodeSettingsModel) {
    if (node) {
      this.nodeSettings = node;
      this.dimmingValueTwo = this.nodeSettings.dimValueTwo;
    }
  }

  setHoldTimeTwoToProfileService() {
    this.nodeSettings.dimValueTwo = this.dimmingValueTwo;
    this.nodeSettings.enableHoldTimeTwo = true;
    this.profileService.setHoldTimeTwoModel(this.nodeSettings);
  }

}
