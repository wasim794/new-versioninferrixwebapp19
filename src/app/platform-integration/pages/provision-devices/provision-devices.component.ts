import {Component, OnInit, ViewChild} from '@angular/core';
import {NodeStatsModel} from '../../../light-commissioning/shared/model/stats/node-stats.model';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {PlatformIntegrationService} from '../../service/platform-integration.service';
import {Observable} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {AbstractDatasourceModel} from "../../../core/models/dataSource";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';


@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule],
  providers: [CommonService, PlatformIntegrationService, DictionaryService],
  selector: 'app-provision-devices',
  templateUrl: './provision-devices.component.html',
  styleUrls: []
})
export class ProvisionDevicesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  displayedColumns: string[] = ['S.No.', 'Devicename', 'Actions'];
  public dataSource!: AbstractDatasourceModel<any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  deleteMsg = "Delete Successfully";
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  search: any;
  UIDICTIONARY : any;

  constructor(
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    public service: PlatformIntegrationService
  ) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
    this.getProvisionedDevices(param);
  }


  getProvisionedDevices(param: string) {
    this.subs.add(this.service.getProvisionedDevices(param).subscribe(data => {
      this.dataSource = data;
    }));
  }

  getNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(+name))';
    this.getProvisionedDevices(param);
  }

  applyFilter(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.search) {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),like(name,%2A' + this.search + '%2A))';
        this.subs.add(this.service.getProvisionedDevices(param).subscribe(data => {
          this.dataSource = data;
        }));
      } else {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getProvisionedDevices(param);
      }
    }
  }

  delete(element: any) {
    this.commonService.openConfirmDialog('Are you sure you want to delete',
      element.name).afterClosed().subscribe(response => {
      if (response) {
      this.subs.add(this.service.deleteProvisionedDevice(element.id).subscribe(data => {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getProvisionedDevices(param);
        this.commonService.notification(this.deleteMsg);
      }));
      return true;
      } else {
        return false;
      }
    });
  }


}



