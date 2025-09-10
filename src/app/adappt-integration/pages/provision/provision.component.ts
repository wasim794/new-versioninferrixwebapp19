import {Component, OnInit, ViewChild} from '@angular/core';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {AdapptIntegrationService} from '../../../adappt-integration';
import {AbstractDatasourceModel} from "../../../core/models/dataSource";
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-provision',
  templateUrl: './provision.component.html'
})
export class ProvisionComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns: string[] = ['serialNumber', 'DeviceName' , 'action'];
  public dataSource: AbstractDatasourceModel<any>[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  search: any;
  profileXid: number;
  deleteMsg = "Delete Successfully";
  UIDICTIONARY : any;

  constructor(public dictionaryService:DictionaryService,  private _commonService: CommonService,
              public _adappt: AdapptIntegrationService) { super(); }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('adapptIntegration').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
    this.getProvisionalData(param);
  }

  getProvisionalData(param: string){
    this.subs.add(this._adappt.getProvisionedDevices(param).subscribe(data => {
      this.dataSource= data;
    }));
  }

  getNextPage(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(+name))';
    this.getProvisionalData(param);
  }

  applyFilter(event) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.search) {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),like(name,%2A' + this.search + '%2A))';
        this.subs.add(this._adappt.getUnprovisionedDevices(param).subscribe(data => {
          this.dataSource = data;
        }));
      } else {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getProvisionalData(param);
      }
    }
  }

  delete(element) {
    this._commonService.openConfirmDialog('Are you want to sure Reset',
      element.name).afterClosed().subscribe(response => {
      if (response) {
      this.subs.add(this._adappt.deleteProvisionedDevice(element.id).subscribe(data => {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getProvisionalData(param);
        this._commonService.notification(this.deleteMsg);
      }));
    } else {
      return false;
    }
  });
  }
}


