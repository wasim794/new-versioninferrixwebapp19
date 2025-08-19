import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {ModbusQueryModel} from '../../models/modbus-query.model';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {ConfigFormComponent} from './config-form/config-form.component';
import {CommonService} from '../../../services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {ModbusQueryService} from "../../service/modbus-query.service";

@Component({
  selector: 'app-config-profile',
  templateUrl: './config-profile.component.html',
  styleUrls: []
})
export class ConfigProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('ConfigDrawer') public configDrawer: MatSidenav;
  @ViewChild(ConfigFormComponent) public getConfigLists: ConfigFormComponent;
  buttons: boolean;
  configListName: string;
  deleteConfigList: any;
  copyConfigList: any;
  configList: any = new ModbusQueryModel();
  limit = 12;
  offset = 0;
  totalList: number;
  searchConfig: any;
  pageSizeOptions: number[] = [12, 16, 20];
  copyMsg ="Copy Successfully";
  deleteMsg = "Delete Successfully";
  UIDICTIONARY:any;

  constructor(public modbusQuery: ModbusQueryService, private commonService: CommonService, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getProfile(this.limit, this.offset);
  }

  getProfile(Limit, offSet) {
    this.subs.add(this.modbusQuery.getModbusLists(Limit, offSet).subscribe(data => {
      this.totalList = data['total'];
      this.configList = data['items'];
    }));
  }

  getNextPage(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getProfile(limit, this.offset);
  }

  sidebarClose(event) {
    this.configDrawer.close();
    this.getProfile(this.limit, this.offset);
  }

  edit(id) {
    this.configDrawer.open(id);
    this.getConfigLists.getConfigList(id);
    this.getConfigLists.isEdit = true;
    this.getConfigLists.condition = true;
    this.getConfigLists.pollingCondition = true;
  }

  copyConfigData(list) {
    this.copyConfigList = list;
    this.getConfigLists.configFormPermissionToModel();
    this.subs.add(this.modbusQuery.copy(this.copyConfigList.id).subscribe(data => {
      this.commonService.notification(this.copyMsg);
      this.ngOnInit();
    }, error => {
      error.result.message.forEach(value=>
        this.commonService.notification(value.message))
      }
    ));
  }

  delete(list) {
    this.deleteConfigList = list;
    this.configListName = this.deleteConfigList.slaveId;
    this.commonService.openConfirmDialog('Would you like to  delete ', this.configListName).afterClosed().subscribe(response => {
      if (response) {
        this.modbusQuery.delete(this.deleteConfigList.id).subscribe(data => {
          this.configList = this.configList.filter((h: any) => h !== this.deleteConfigList);
          this.commonService.notification(this.deleteMsg);
        });
      }
    });
  }

  addNewConfig(id) {
    this.configDrawer.open();
    this.getConfigLists.getConfigListReset(id);
    this.getConfigLists.isEdit = false;
  }

  filterConfig() {
    if (this.searchConfig) {
      const param = 'like(name,%2A' + this.searchConfig + '%2A)';
      this.searchConfigData(param);
    } else {
      const param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.searchConfigData(param);
    }
  }

  searchConfigData(param) {
    this.subs.add(this.modbusQuery.get(param).subscribe(data => {
      this.configList = data;
    }));
  }
}
