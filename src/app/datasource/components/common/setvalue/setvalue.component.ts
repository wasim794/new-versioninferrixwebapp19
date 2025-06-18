import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SetValueModel} from '../../../model/setValueModel';
import {CommonService} from '../../../../services/common.service';
import {PointValueService} from '../../../../core/services';
import {ConfigurationService} from '../../../../services/configuration.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  selector: 'app-setvalue',
  templateUrl: './setvalue.component.html',
  styleUrls: []
})
export class SetvalueComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  setValueModel: any = SetValueModel;
  xid!: string;
  httpSenderError: any = [];
  isBinary = false;
  binaryValue!: string;
  zeroLabel!: string;
  oneLabel!: string;
  saveMsg ='save successfully';
  UIDICTIONARY : any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private commonService: CommonService,
              private _pointValue: PointValueService,
              public dictionaryService: DictionaryService,
              private _configurationService: ConfigurationService
  ) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
        });
    this.setValueModel = new SetValueModel();
    this.xid = this.data.dataPoint.xid;
    this.setValueModel.dataType = this.data.dataPoint.pointLocator.dataType;
    this.isBinary = this.setValueModel.dataType === 'BINARY' && this.data.dataPoint.textRenderer.type === 'textRendererBinary';
    this.zeroLabel = this.data.dataPoint.textRenderer.zeroLabel;
    this.oneLabel = this.data.dataPoint.textRenderer.oneLabel;
    if (this.isBinary) {
      this.binaryValue = this.data.dataPoint.websocketStatus;
      this.setValueModel.value = this.oneLabel === this.data.dataPoint.websocketStatus;
    } else {
      this.setValueModel.value = this.data.dataPoint.websocketStatus;
    }
  }

  updateSetValues() {
    this.subs.add(this._pointValue.setPointValue(this.xid, this.setValueModel).subscribe(data => {
        this.commonService.notification(this.saveMsg);

      }, err => {
        err.forEach((prop: any) => {
          this.httpSenderError.push(prop);
        });
        this.commonService.messageDisplay('errorMsg');
      })
    );
  }
}
