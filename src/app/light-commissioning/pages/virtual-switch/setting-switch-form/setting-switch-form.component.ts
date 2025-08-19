import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {VirtualSwitchControlModel} from '../../../shared/model';
import {VirtualSwitchService} from '../../../shared/service';
import {CommonService} from '../../../../services/common.service';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [VirtualSwitchService, DictionaryService],
  selector: 'app-setting-switch-form',
  templateUrl: './setting-switch-form.component.html',
  styleUrls: []
})
export class SettingSwitchFormComponent implements OnInit {
  onOffValue!: boolean;
  xid!: string;
  settingError: any = [];
  errorMsg!: string;
  saveSuccessMsg = 'Command Sent';
  public onOffValueRadio = true;
  public dimValueRadio = false;
  public autoValueRadio = false;
  virtualControlModel!: VirtualSwitchControlModel;
  public messageError!: boolean;
  public UIDICTIONARY:any;

  constructor(private service: VirtualSwitchService,
              public dictionaryService: DictionaryService,
              private _commonService: CommonService,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.virtualControlModel = new VirtualSwitchControlModel();
    this.xid = this.data.virtualSwitch.xid;
    this.onOffValueRadios();

  }

  private onOffValueRadios() {
    if (this.virtualControlModel.autoMode === false &&
      (this.virtualControlModel.dimValue > 0 || this.virtualControlModel.dimValue === 100)) {
      this.onOffValueRadio = true;
      this.onOffValue = this.virtualControlModel.dimValue !== 0;
    }
  }

  selectTab(selected: any): void {
    if (selected === '1') {
      this.onOffValues();
    } else if (selected === '2') {
      this.dimValues();
    } else if (selected === '3') {
      this.autoValues();
    }
  }

  private onOffValues() {
    this.onOffValueRadio = true;
    this.dimValueRadio = false;
    this.autoValueRadio = false;
  }

  private dimValues() {
    this.onOffValueRadio = false;
    this.dimValueRadio = true;
    this.autoValueRadio = false;
  }

  private autoValues() {
    this.onOffValueRadio = false;
    this.dimValueRadio = false;
    this.autoValueRadio = true;
  }

  pushData(xid: string) {
    this.populateVirtualControlModel();
    this.service.control(this.virtualControlModel, xid).subscribe(data => {
      this.virtualControlModel = data;
      this._commonService.notification(this.data.virtualSwitch.name + ' ' + this.saveSuccessMsg);
    }, error => {
      this.settingError = error.result.message;
      this.timeOutFunction();
    });
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }


  private populateVirtualControlModel() {
    if (this.onOffValueRadio) {
      this.virtualControlModel.dimValue = this.onOffValue ? 100 : 0;
      this.virtualControlModel.autoMode = false;
    }

    if (this.dimValueRadio) {
      !this.virtualControlModel.autoMode?this.virtualControlModel.autoMode = false : this.virtualControlModel.autoMode=true;
    }

    if (this.autoValueRadio) {
      this.virtualControlModel.dimValue = 50;
    }
  }
}
