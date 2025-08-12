import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {VirtualSwitchService} from '../../shared/service';
import {VirtualSwitchModel} from '../../shared/model';
import {MatDialog} from '@angular/material/dialog';
import {VirtualSwitchFormComponent} from './virtual-switch-form/virtual-switch-form.component';
import {SettingSwitchFormComponent} from './setting-switch-form/setting-switch-form.component';
import {CommonService} from 'src/app/services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../../core/services/dictionary.service";

@Component({
  selector: 'app-virtual-switch',
  templateUrl: './virtual-switch.component.html',
  styleUrls: []
})
export class VirtualSwitchComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  dimValue: number;
  status: boolean;
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [8, 16, 20];
  deleteMsg = "Delete Successfully";
  @ViewChild('virtualSwitch') public virtualSwitch: MatSidenav;
  @ViewChild('settingvirtualSwitch') public settingvirtualSwitch: MatSidenav;
  @ViewChild(VirtualSwitchFormComponent) private virtualSwitchForm: VirtualSwitchFormComponent;
  tabIndex = 0;
  virtualSwitches: VirtualSwitchModel[];
  public UIDICTIONARY:any;

  constructor(public service: VirtualSwitchService,
              public dialog: MatDialog, public dictionaryService: DictionaryService, private _commonService: CommonService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('lightCommissioning').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getVirtualSwitches(param);
  }

  getVirtualSwitches(param: string) {
    this.virtualSwitches = [];
    this.service.get(param).subscribe((switches) => {
      this.virtualSwitches = switches;
    });
  }

  openSidebarVirtual() {
    this.virtualSwitch.open();
    this.virtualSwitchForm.addInit();
  }

  virtualSwitchClose() {
    this.virtualSwitch.close();
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getVirtualSwitches(param);
  }

  getNext(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getVirtualSwitches(param);
  }

  edit(model: VirtualSwitchModel) {
    this.virtualSwitch.open();
    this.virtualSwitchForm.edit(model);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let param;
    if (filterValue.length)
      param = 'like(name,%2A' + filterValue + '%2A)';
    else
      param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getVirtualSwitches(param);
  }

  delete(xid: string, name) {
    this._commonService.openConfirmDialog('Are you sure , you want to delete.....? ', name).afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.service.delete(xid).subscribe(data => {
          if (data) {
            const param = 'limit(' + this.limit + ',' + this.offset + ')';
            this.getVirtualSwitches(param);
          }
        }, error => {
          console.log(error);
          const param = 'limit(' + this.limit + ',' + this.offset + ')';
          this.getVirtualSwitches(param);
          this._commonService.notification(this.deleteMsg);
        }));
      }
    });
  }

  setting(virtualSwitch) {
    this.dialog.open(SettingSwitchFormComponent, {
      height: '300px',
      width: '320px',
      data: {virtualSwitch: virtualSwitch},
      disableClose: true
    });
  }
}
