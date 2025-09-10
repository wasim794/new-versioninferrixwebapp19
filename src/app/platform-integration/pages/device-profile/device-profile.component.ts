import {Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatDrawer, MatSidenav} from '@angular/material/sidenav';
import {CommonService} from '../../../services/common.service';
import {PlatformIntegrationService} from '../../service/platform-integration.service';
import {MqttIntegrationModel} from '../../models/mqtt-integration.model';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {DeviceProfileFormComponent} from './device-profile-form/device-profile-form.component';
import {DictionaryService} from "../../../core/services";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {DeviceProfileModel} from "../../models/device-profile.model";
import {MatSort} from "@angular/material/sort";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';


@Component({
  standalone: true,
  imports: [MatSidenav, DeviceProfileFormComponent, CommonModule, MatModuleModule],
  providers: [CommonService, PlatformIntegrationService, DictionaryService],
  selector: 'app-device-configuration',
  templateUrl: './device-profile.component.html',
  styleUrls: []
})
export class DeviceProfileComponent extends UnsubscribeOnDestroyAdapter implements OnInit, AfterViewInit  {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['S.No.', 'Name', 'Description', 'Actions'];
  dataSource: any = new MatTableDataSource<DeviceProfileModel>();
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [8, 15, 20];
  @ViewChild('deviceDrawer') public deviceDrawer!: MatSidenav;
  @ViewChild(DeviceProfileFormComponent) public deviceConfigurationFormComponent!: DeviceProfileFormComponent;
  UIDICTIONARY : any;

  constructor(private dialog: MatDialog,
              private commonService: CommonService,
              public platformIntegrationService: PlatformIntegrationService,
              public dictionaryService: DictionaryService,) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getProfileDevice(param);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      const filterValue = (event.target as HTMLInputElement).value;
      if (filterValue) {
        const param = 'like(name,%2A' + filterValue + '%2A)';
        this.getProfileDevice(param);
      } else {
        const param = 'limit(' + this.limit + ',' + this.offset + ')';
        this.getProfileDevice(param);
      }
    }
  }


  getProfileDevice(param: string){
    this.subs.add(this.platformIntegrationService.getDeviceProfiles(param).subscribe(data=>{
      this.dataSource = data;
    }));
  }

  allClose(key: any) {
    this.deviceDrawer.close();
    // this.refreshPage();
  }


  addNew(value: any) {
    this.deviceDrawer.open();
    this.deviceConfigurationFormComponent.addNewMain(value);
  }

  deviceRemove(list: any){
    // we are using ID for the delete function
    this.commonService.openConfirmDialog('Are you sure you want to delete ' ,  list.name).afterClosed().subscribe(data=>{
      if(data) {
        this.platformIntegrationService.deleteDeviceProfile(list.id).subscribe(data => {
          this.commonService.notification('Successfully Deleted' + ' ' + data.name);
          // this.getDeviceList(event);
        });

      }
    });
  }

  getNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(+name))';
    this.getProfileDevice(param);
  }

  sinkThingsBoard(){
    this.subs.add(this.platformIntegrationService.syncDeviceProfiles().subscribe(data=>{
      console.log(data);
      this.dataSource = data;
      const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
      this.getProfileDevice(param);
    }))
  }
  editOpenForm(element: any){
    this.deviceDrawer.open();
    this.deviceConfigurationFormComponent.getDeviceListByKey(element);
  }

}
