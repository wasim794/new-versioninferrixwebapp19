import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {ModbusControllerModel} from "../../../models";
import {CommonService} from '../../../../services/common.service';
import {ModbusControllerService} from "../../../service/modbus-controller.service";
import {ModbusQueryService} from "../../../service/modbus-query.service";
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';

@Component({
  standalone: true,
  imports:[CommonModule,  MatModuleModule],
  providers:[ModbusControllerService, ModbusQueryService, CommonService, DictionaryService],
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: []
})
export class QueryModelComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  queryList: any = new ModbusControllerModel();
  discoverNodes: any = new ModbusControllerModel();
  limit = 20;
  offset = 0;
  totalList!: any;
  pageSizeOptions: number[] = [20, 40, 60];
  queryListOptions: any;
  queryOptions: any;
  isSelected: any;
  test: any;
  arrayFilter: any=[];
  searchDiscovered: any;
  UIDICTIONARY:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private queryAllList: any,
    public dialogRef: MatDialogRef<QueryModelComponent>,
    public modbusController: ModbusControllerService,
    public modbusQuery: ModbusQueryService,
    public commonService: CommonService,
    public dictionaryService: DictionaryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('modbus').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.queryListOptions = this.queryAllList;
    this.getProfile(this.limit, this.offset);
  }

  getDiscoveredNodes(param: any) {
    this.subs.add(this.modbusController.get(param).subscribe(data => {
      this.discoverNodes = data;
    }));
  }
  getProfile(Limit: any, offSet: any) {
    this.subs.add(this.modbusQuery.getModbusLists(Limit, offSet).subscribe((data: any) => {
      this.totalList = data['total'];
      this.queryList = data['items'];
      this.selectedQueryList();
    }));
  }

  getNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getProfile(limit, this.offset);
  }

  allClose(event: any) {
    this.dialogRef.close();
  }

  queryChange(event: any) {
    this.queryOptions = event;
  }

  selectedQueryList() {
    this.queryOptions = [];
    this.queryListOptions.queryAllList.mappings.forEach((value: any, index: any) => {
      this.test = value.modbusQueryId;
      this.queryOptions.push(value.modbusQueryId);
    });
  }

  filterDiscovered() {
    if (this.searchDiscovered) {
      const param = 'like(name,%2A' + this.searchDiscovered + '%2A)';
      this.subs.add(this.modbusQuery.get(param).subscribe(data => {
        this.queryList = data;
      }));
    } else {
      this.getProfile(this.limit, this.offset);
    }
  }

  updateQuery() {
    this.queryListOptions.queryAllList.mappings.forEach((data: any)=>{
      this.arrayFilter.push(data.modbusQueryId);
    });
    let missing = this.queryOptions.
    filter((item: any) => this.arrayFilter.indexOf(item) < 0);
      const id = this.queryListOptions.queryAllList.id;
      const queryId = missing;
      const enabled = this.queryListOptions.queryAllList.status;
      this.subs.add(this.modbusController.sendModbusQueryIdList(id, queryId, enabled).subscribe(data => {
        data.complete===false?this.commonService.notification('modbus settings read request sent database')
            :this.commonService.notification('modbus settings read request sent gateway');
        this.getProfile(this.limit, this.offset);
      }));
  }
}
