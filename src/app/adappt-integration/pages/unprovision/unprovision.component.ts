import {Component, OnInit, ViewChild} from '@angular/core';
import { DictionaryService } from '../../../core/services/dictionary.service';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {AdapptIntegrationService} from '../../../adappt-integration/service/adappt-integration.service';
import {AbstractDatasourceModel} from "../../../core/models/dataSource";
import {MatPaginator} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule],
  providers: [AdapptIntegrationService, CommonService, DictionaryService],
  selector: 'app-unprovision',
  templateUrl: './unprovision.component.html'
})
export class UnprovisionComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns: string[] = ['serialNumber', 'DeviceName' , 'action'];
  public dataSource!: AbstractDatasourceModel<any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  search: any;
  profileXid!: number;
  provisionData="Provision Successfully Send";
  UIDICTIONARY : any;


  constructor(public dictionaryService:DictionaryService, public _commonService: CommonService,
              public _adappt: AdapptIntegrationService) { super(); }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('adapptIntegration').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
    this.getUnProvisionalData(param);
  }

  getUnProvisionalData(param: string){
    this.subs.add(this._adappt.getUnprovisionedDevices(param).subscribe(data => {
      this.dataSource= data;
    }));
  }

  getNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(+name))';
    this.getUnProvisionalData(param);
  }

  applyFilter(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.search) {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),like(name,%2A' + this.search + '%2A))';
        this.subs.add(this._adappt.getUnprovisionedDevices(param).subscribe(data => {
          this.dataSource = data;
        }));
      } else {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getUnProvisionalData(param);
      }
    }
  }

  transferUnprovisionedData(event: any) {
    this._commonService.openConfirmDialog('Are you sure you want to send',
      event.name + "'" + " to Provisioned Devices").afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this._adappt.provisionDevice(event.id).subscribe(data => {
            this._commonService.notification(this.provisionData)
            const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
            this.getUnProvisionalData(param);
          }, err => console.log(err)
        ));
        return true;
      } else {
        return false;
      }
    });
  }
  goBack() {
    this._commonService.goBackHistory();
  }
}

