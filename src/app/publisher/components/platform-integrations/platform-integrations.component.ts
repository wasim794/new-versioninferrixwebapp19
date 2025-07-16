import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {IntegrationPointModel, IntegrationSenderModel, IntegrationSenderService,IntegrationSenderPointService } from "../platform-integrations";
import {TimePeriodModel} from "../../../core/models/timePeriod";
import {DataPointModel} from "../../../core/models/dataPoint";
import {DataPointService } from "../../../core/services";
import {MatTableDataSource} from "@angular/material/table";
import {MeshSenderDropdownData} from '../mesh';
import {PUBLISHER_TOPIC_TYPE,QOS_TYPE,SUBSCRIBERS_TOPIC_TYPE,} from "../mqtt/dropdown.data";
import {ReactiveFormsModule, FormControl} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, ReactiveFormsModule],
  providers: [DataPointService, IntegrationSenderService, IntegrationSenderPointService],
  selector: 'app-platform-integrations',
  templateUrl: './platform-integrations.component.html'
})
export class PlatformIntegrationsComponent   extends UnsubscribeOnDestroyAdapter implements OnInit {

     displayedColumns: string[] = [
       "position",
       "name",
       "publish_Topic_type",
       "publish_Topic",
       "subscribe_Topic",
       "subscribe_Topic_type",
       "qos_Type",
       "action",
     ];
     @Output() responsePublisherSave = new EventEmitter<any>();
     @Output() responsePublisherUpdate = new EventEmitter<any>();
     myControl = new FormControl('');
     saveSuccessMsg = 'is saved successfully';
     updateSuccessMsg = 'is updated successfully';
     deleteSuccessMsg = "is delete successfully";
     error: any = [];
     public messageError!: boolean;
     pointValues: boolean=false;
     selectionData!: boolean;
     public dataPointModels: DataPointModel[] = [];
     searchDatasource!: string;
     limit = 10;
     offset = 0;
     public selectionValue: any;
     public isEdit!: boolean;
     public integrationSenderModel:any = new IntegrationSenderModel();
     public  integrationPointModel :any= new IntegrationPointModel();
     public dropdownData = new MeshSenderDropdownData();
     pubXid!: any;
     dataPointXID!: any;
     public dataSource:any;
     showDataPointFields:boolean=false;
     searchDatapoint:any;
     public dataPointActions!: boolean;
     UIDICTIONARY : any;
     viewDataPoint: boolean = false;
     integrationSenderTitle:boolean=false;
     dataSources: MatTableDataSource<any> = new MatTableDataSource<IntegrationPointModel[]>([]);
     public publisherTopicType = PUBLISHER_TOPIC_TYPE;
     public subscriberTopicType = SUBSCRIBERS_TOPIC_TYPE;
     public qosType = QOS_TYPE;

     constructor(
           public dictionaryService: DictionaryService,
           private _commonService: CommonService,
           private _integrationSenderService: IntegrationSenderService,
           private _integrationSenderPointService: IntegrationSenderPointService,
           private _dataPointService : DataPointService

     ) {
          super();
     }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('mqtt').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.integrationSenderModel.snapshotSendPeriod = new TimePeriodModel();
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPoints(param);

  }

 getDataPoints(param: any) {
    let params = param;
    this._dataPointService.get(params).subscribe(data=>{
      this.dataPointModels = data;
    });
  }

  selectedValue(dataPoint: any) {
    this.selectionData = false;
    this.showDataPointFields=true;
    this.dataPointActions = true;
    this.dataPointXID = dataPoint.xid;
    this.searchDatasource = dataPoint.name + "-" + dataPoint.dataSourceName;
    this.integrationPointModel = new IntegrationPointModel();
  }

  savePlatform(){
    this.integrationSenderModel.points = [];
    this.subs.add(this._integrationSenderService.create(this.integrationSenderModel).subscribe(data=>{
      this._commonService.notification(this.integrationSenderModel.name +' '+this.saveSuccessMsg)
      this.responsePublisherSave.emit(data);
    }))
  }

  updatePlatform(){
    this.integrationSenderModel.points = [];
    this.subs.add(this._integrationSenderService.update(this.integrationSenderModel).subscribe(data=>{
      this._commonService.notification(this.integrationSenderModel.name +' '+this.updateSuccessMsg);
      this.responsePublisherUpdate.emit(data);
    }))
  }

  getPlatform(xid:string){
       this.subs.add(this._integrationSenderService.getByXid(xid).subscribe(data=>{
      this.pubXid = data.xid;
      this.integrationSenderModel = data;
      this.isEdit=true;
      this.pointValues = true;
      this.dataSources.data = this.integrationSenderModel.points;
    }))
    this.integrationSenderTitle = true;
  }

  autoSearch() {
    if (this.searchDatasource === '') {
      this.selectionData = false;
    } else {
      this.selectionData = true;
      const param = 'like(name,%2A' + this.searchDatasource + '%2A)|like(deviceName,%2A' + this.searchDatasource + '%2A)';
      //return false;
      this.getDataPoints(param);
    }
  }

  saveDataPoint(){
    this.integrationPointModel.dataPointXid = this.dataPointXID;
    this.integrationPointModel.publisherXid = this.pubXid;
    this.integrationPointModel.modelType = "INTEGRATION_MQTT_SENDER.POINT";
    this.subs.add(this._integrationSenderPointService.create(this.integrationPointModel).subscribe((data: any)=>{
      this._commonService.notification(this.integrationPointModel.name +' '+this.saveSuccessMsg);
      this.getPlatform(this.integrationPointModel.publisherXid);
      this.showDataPointFields = false;
    }))
  }

  updateDataPoint(){
    this.integrationPointModel.dataPointXid = this.dataPointXID;
    this.integrationPointModel.publisherXid = this.pubXid;
    this.subs.add(this._integrationSenderPointService.update(this.integrationPointModel).subscribe((data: any)=>{
      this._commonService.notification(this.integrationPointModel.name +' '+this.updateSuccessMsg);
      this.getPlatform(this.integrationPointModel.publisherXid);
      this.showDataPointFields = false;
    }))
  }

  edit(element: any){
    this.dataPointActions=false;
    this.showDataPointFields = true;
    this.subs.add(this._integrationSenderPointService.getByXid(element.xid).subscribe((data: any)=>{
    this.integrationPointModel = data;
    this.subs.add(this._dataPointService.getByXid(this.integrationPointModel.dataPointXid).subscribe(dataPoint=>{
    this.searchDatasource = dataPoint.name + "-" + dataPoint.dataSourceName;
    this.viewDataPoint=true;
    this.dataPointXID = dataPoint.xid;
  }))
  }))
  }

 addNewDatapoint(){
  this.viewDataPoint=true
  }

  removeData(element: any) {
    this.subs.add(
      this._integrationSenderPointService
        .delete(element.xid)
        .subscribe((data: any) => {
          this._commonService.notification(
            element.name + " " + this.deleteSuccessMsg
          );
          this.getPlatform(this.integrationPointModel.publisherXid);
        })
    );
  }

  applyFilter(filterValue: any) {
    this.dataSources.filter = filterValue.target.value.trim().toLowerCase();
  }
  cancel(){
    this.showDataPointFields = false;
  }

  onInputChange(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    const param = 'like(name,%2A' + filterValue + '%2A)|like(deviceName,%2A' + filterValue + '%2A)';
    //return false;
    this.getDataPoints(param);
  }

  deviceChange(selectedOption: any, event: any): void {
    if (event.isUserInput) {
      this.selectionData = false;
      this.showDataPointFields=true;
      this.dataPointActions = true;
      this.dataPointXID = selectedOption.xid;
      this.showDataPointFields=true;
      const param = 'limit(' + this.limit + ',' + this.offset + ')';
      //return false;
      this.getDataPoints(param);
    }
    }


}


