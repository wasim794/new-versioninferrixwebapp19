import {Component, OnInit, ViewChild} from '@angular/core';
import { DictionaryService } from 'src/app/core/services/dictionary.service';
import {CommonService} from '../../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import { MeshPublisherService} from "../../../shared/services";
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {FileModel} from "../../../../core/models/files/file.model";

@Component({
  selector: 'app-unprovision',
  templateUrl: './unprovision.component.html'
})
export class UnprovisionComponent extends UnsubscribeOnDestroyAdapter implements OnInit  {
  displayedColumns: string[] = ['serialNumber', 'DeviceName', 'action'];
  public dataSource: any = new MatTableDataSource<FileModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  search: any;
  profileXid: number;
  deleteMsg = "Delete Successfully";
  provisionData="Provision Successfully Send";
  UIDICTIONARY : any;

  constructor(public meshPublisherService: MeshPublisherService,
              public commonService: CommonService,
              public dialog: MatDialog,
              public dictionaryService: DictionaryService,) {  super()}

  ngOnInit(): void {
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
    this.getUnprovisionalData(param);
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
         this.UIDICTIONARY= this.dictionaryService.uiDictionary;
         });


  }

  getUnprovisionalData(param: string) {
    this.subs.add(this.meshPublisherService.getUnprovisionedDevicesMeshOn(param).subscribe(data => {
      this.dataSource = data
    }));
  }

  getNextPage(event) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(+name))';
    this.getUnprovisionalData(param);
  }

  applyFilter(event) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.search) {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),like(name,%2A' + this.search + '%2A))';
        this.subs.add(this.meshPublisherService.getUnprovisionedDevicesMeshOn(param).subscribe(data => {
          this.dataSource = data;
        }));
      } else {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getUnprovisionalData(param);
      }
    }
  }
  transferUnprovisionedData(event) {
    // return;
    this.commonService.openConfirmDialog('Are you sure you want to send',
      event.name + "'" + " to Provisioned Devices").afterClosed().subscribe(response => {
      if (response) {
        this.subs.add(this.meshPublisherService.provisionDevice(event.id).subscribe(data => {
            this.commonService.notification(this.provisionData)
            const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
            this.getUnprovisionalData(param);
          }, err => console.log(err)
        ));
      } else {
        return false;
      }
    });
  }

}

