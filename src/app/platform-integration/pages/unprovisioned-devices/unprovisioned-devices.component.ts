import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {PlatformIntegrationService} from '../../service/platform-integration.service';
import {MatPaginator} from '@angular/material/paginator';
import {AbstractDatasourceModel} from "../../../core/models/dataSource";
import {DictionaryService, SystemSettingService} from "../../../core/services";
import {MqttIntegrationModel} from "../../models/mqtt-integration.model";
import {ProvisionGatewayComponent} from './provision-gateway/provision-gateway.component';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, ReactiveFormsModule],
  providers: [CommonService, PlatformIntegrationService, SystemSettingService, DictionaryService],
  selector: 'app-unprovision-devices',
  templateUrl: './unprovisioned-devices.component.html',
  styleUrls: []
})
export class UnprovisionedDevicesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns: string[] = ['position', 'DeviceName', 'DeviceType', 'Actions'];
  unprovisioned = [];
  public dataSource!: AbstractDatasourceModel<any>[];
  public provision = "Update Successfully";
  queryList: any = new MqttIntegrationModel();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  search: any;
  profileId!: number;
  provisionData="Provision Successfully Send";
  UIDICTIONARY : any;
  thingsBoardGatewayStatus :any;
  isDisabled = false;
  myControl = new FormControl('');


  constructor(
    public dictionaryService: DictionaryService,public dialog: MatDialog,
    private commonService: CommonService,
    public service: PlatformIntegrationService,
    private systemSettingService: SystemSettingService
  ) {
    super();

  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('platformIntegration').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
    this.getUnprovisionedData(param);
    this.getDeviceList();
    this.getStatusProvisionGateway();
  }

  getStatusProvisionGateway(){
    const thingsBoardGateway = 'thingsboardGatewayProvisioned';
    this.subs.add(this.systemSettingService.getSystemSettingsByKey(thingsBoardGateway).subscribe(data=>{
      this.thingsBoardGatewayStatus = data;
      this.thingsBoardGatewayStatus==="Y" ? this.isDisabled = !this.isDisabled:this.isDisabled = this.isDisabled;

    }));
  }

  getUnprovisionedData(param: string) {
    this.subs.add(this.service.getUnprovisionedDevices(param).subscribe(data => {
      this.dataSource = data;
    }));
  }

  getNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'and(limit(' + limit + ',' + this.offset + '),sort(+name))';
    this.getUnprovisionedData(param);
  }

  applyFilter(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.search) {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),like(name,%2A' + this.search + '%2A))';
        this.subs.add(this.service.getUnprovisionedDevices(param).subscribe(data => {
          this.dataSource = data;
        }));
      } else {
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getUnprovisionedData(param);
      }
    }
  }

  deviceChange(selectedOption: { id: number, name: string }, event: any): void {
    if (event.isUserInput) {
      this.profileId = selectedOption.id;
    }
  }

  transferUnprovisionedData(event: any) {
    
    // return;
    this.commonService.openConfirmDialog('Are you sure you want to send',
      event.name  + "'" + " to Provisioned Devices !").afterClosed().subscribe(response => {
      if (response) {
      this.subs.add(this.service.provisionDevice(event.xid, this.profileId).subscribe(data => {
          this.commonService.notification(this.provisionData)
        const param = 'and(limit(' + this.limit + ',' + this.offset + '),sort(+name))';
        this.getUnprovisionedData(param);
        this.myControl.setValue('');

        }, err => console.log(err)
      ));
       return true;
      } else {
        return false;
      }
    });
  }
    getDeviceList() {
      this.subs.add(this.service.getDeviceProfiles().subscribe(data => {
          this.queryList = data;
        }, err => console.log(err)
      ));
    }

  onInputChange(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    const param = 'like(name,%2A' + filterValue + '%2A)';
    this.subs.add(this.service.getDeviceProfiles(param).subscribe(data => {
        this.queryList = data;
      }, err => console.log(err)
    ));
  }

  provisionGateway() {
    const dialogRef = this.dialog.open(ProvisionGatewayComponent,
  { width: '300px', height: '350px', disableClose:true });
    dialogRef.afterClosed().subscribe(result => {
      result=='success'? this.commonService.notification("Provision Gateway Successfully"):'';

    });
  }



}






