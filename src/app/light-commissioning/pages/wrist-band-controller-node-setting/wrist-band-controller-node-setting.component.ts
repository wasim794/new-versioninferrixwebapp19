import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {NodeService} from '../../shared/service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {WristBandNodeModel, WristBandSettingsModel} from '../../shared/model';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [NodeService, DictionaryService],
  selector: 'app-wrist-band-controller-node-setting',
  templateUrl: './wrist-band-controller-node-setting.component.html',
  styleUrls: []
})
export class WristBandControllerNodeSettingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  wristBandNode = {} as WristBandNodeModel;
  wristBandSettings = {} as WristBandSettingsModel;
  nodeXid: any;
  UIDICTIONARY:any;

  constructor(
    private commonService: CommonService,
    public dictionaryService: DictionaryService,
    private nodeService: NodeService) {
    super();
  }

  ngOnInit() {
    this.nodeXid = this.nodeService.nodeXid;
    this.subs.add(this.nodeService.getNodeByXid(this.nodeXid).subscribe(data => {
      this.wristBandNode = data;
      this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
      this.wristBandSettings = this.wristBandNode.profile.wristBandSettings;
    }, err => console.log(err)));
  }
}
