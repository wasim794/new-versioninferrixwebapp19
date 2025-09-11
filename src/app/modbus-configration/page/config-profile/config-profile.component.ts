import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {ModbusQueryModel} from '../../models/modbus-query.model';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {ConfigFormComponent} from './config-form/config-form.component';
import {CommonService} from '../../../services/common.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {ModbusQueryService} from "../../service/modbus-query.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule,ConfigFormComponent],
  providers: [ModbusQueryService, CommonService, DictionaryService],
  selector: 'app-config-profile',
  templateUrl: './config-profile.component.html',
  styleUrls: []
})
export class ConfigProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('ConfigDrawer') public configDrawer!: MatSidenav;
  @ViewChild(ConfigFormComponent) public getConfigLists!: ConfigFormComponent;
  buttons!: boolean;
  configListName!: string;
  deleteConfigList: any;
  copyConfigList: any;
  configList: any = new ModbusQueryModel();
  limit = 12;
  offset = 0;
  totalList!: any;
  searchConfig: any;
  pageSizeOptions: number[] = [12, 16, 20];
  copyMsg ="Copy Successfully";
  deleteMsg = "Delete Successfully";
  UIDICTIONARY:any;

  constructor(public modbusQuery: ModbusQueryService, public commonService: CommonService, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getProfile(this.limit, this.offset);
  }

  getProfile(Limit: any, offSet: any) {
    this.subs.add(this.modbusQuery.getModbusLists(Limit, offSet).subscribe((data: any) => {
      this.totalList = data['total'];
      this.configList = data['items'];
    }));
  }

  getNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getProfile(limit, this.offset);
  }

  sidebarClose(event: any) {
    this.configDrawer.close();
    this.getProfile(this.limit, this.offset);
  }

  edit(id: any) {
    this.configDrawer.open(id);
    this.getConfigLists.getConfigList(id);
    this.getConfigLists.isEdit = true;
    this.getConfigLists.condition = true;
    this.getConfigLists.pollingCondition = true;
  }

  copyConfigData(list: any) {
    this.copyConfigList = list;
    this.getConfigLists.configFormPermissionToModel();
    this.subs.add(this.modbusQuery.copy(this.copyConfigList.id).subscribe(data => {
      this.commonService.notification(this.copyMsg);
      this.ngOnInit();
    }, error => {
      error.result.message.forEach((value: any)=>
        this.commonService.notification(value.message))
      }
    ));
  }

  delete(list: any) {
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

  addNewConfig(id: any) {
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

  searchConfigData(param: any) {
    this.subs.add(this.modbusQuery.get(param).subscribe(data => {
      this.configList = data;
    }));
  }

  goBack() {
    this.commonService.goBackHistory();
  }

}
