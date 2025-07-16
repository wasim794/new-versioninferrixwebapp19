import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from '../../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common';
import {DictionaryService} from "../../../../core/services";
import {MeshSenderModel, MeshSenderPointModel, MeshSenderPointService, MeshSenderService, MeshSenderDropdownData} from '../../mesh';
import {TimePeriodModel} from "../../../../core/models/timePeriod";
import {DataPointModel} from "../../../../core/models/dataPoint";
import { DataPointService } from "../../../../core/services";
import {MatTableDataSource} from "@angular/material/table";
import {ReactiveFormsModule, FormControl} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';


@Component({
  standalone: true,
    imports:[CommonModule, MatModuleModule, ReactiveFormsModule],
    providers: [DictionaryService, DataPointService],
  selector: 'app-mesh-sender',
  templateUrl: './mesh-sender.component.html'
})
export class MeshSenderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Output() responsePublisherSave = new EventEmitter<any>();
  @Output() responsePublisherUpdate = new EventEmitter<any>();
  myControl = new FormControl('');
  saveSuccessMsg = 'is saved successfully';
  updateSuccessMsg = 'is updated successfully';
  deleteSuccessMsg = "is delete successfully";
  error: any = [];
  displayedColumns: string[] = [
    "position",
    "name",
    "enabled",
    "type",
    "action",
  ];
  public messageError!: boolean;
  pointValues: boolean=false;
  selectionData!: boolean;
  public dataPointModels: DataPointModel[] = [];
  searchDatasource!: string;
  limit = 10;
  offset = 0;
  public selectionValue: any;
  public isEdit!: boolean;
  public meshSenderModel:any = new MeshSenderModel();
  public  meshSenderPointModel :any= new MeshSenderPointModel();
  public dropdownData = new MeshSenderDropdownData();
   pubXid!: any;
  dataPointXID!: any;
  public dataSource:any;
  showDataPointFields:boolean=false;
  searchDatapoint:any;
  public dataPointActions!: boolean;
  UIDICTIONARY : any;
  meshSenderTitle:boolean=false;
  viewDataPoint: boolean = false;
  dataSources: MatTableDataSource<any> = new MatTableDataSource<MeshSenderPointModel[]>([]);

  constructor(
    public dictionaryService: DictionaryService,
    private _commonService: CommonService,
    private _meshSenderService: MeshSenderService,
    private _meshSenderPointService: MeshSenderPointService,
    private _dataPointService : DataPointService

  ) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.meshSenderModel.snapshotSendPeriod = new TimePeriodModel();
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPoints(param);

  }

  getDataPoints(param: any) {
    let params = param;
    this._dataPointService.get(params).subscribe(data=>{
      this.dataPointModels = data;
    });
  }

addNewDatapoint(){
  this.viewDataPoint=true
  }

  saveMeshSender(){
    this.meshSenderModel.points = [];
    this.subs.add(this._meshSenderService.create(this.meshSenderModel).subscribe(data=>{
      this._commonService.notification(this.meshSenderModel.name +' '+this.saveSuccessMsg)
      this.responsePublisherSave.emit(data);
    }))

  }
  updateMeshSender(){
    this.meshSenderModel.points = [];
    this.subs.add(this._meshSenderService.update(this.meshSenderModel).subscribe(data=>{
      this._commonService.notification(this.meshSenderModel.name +' '+this.updateSuccessMsg);
      this.responsePublisherUpdate.emit(data);
    }))
  }

  getMeshSender(xid:string){
    this.subs.add(this._meshSenderService.getByXid(xid).subscribe(data=>{
      this.pubXid = data.xid;
      this.meshSenderModel = data;
      this.isEdit=true;
      this.pointValues = true;
      this.dataSources.data = this.meshSenderModel.points;
    }))
    this.meshSenderTitle = true;
  }

  saveDataPoint(){
    this.meshSenderPointModel.dataPointXid = this.dataPointXID;
    this.meshSenderPointModel.publisherXid = this.pubXid;
    this.subs.add(this._meshSenderPointService.create(this.meshSenderPointModel).subscribe((data: any)=>{
      this._commonService.notification(this.meshSenderPointModel.name +' '+this.saveSuccessMsg);
      this.getMeshSender(this.meshSenderPointModel.publisherXid);
      this.showDataPointFields = false;
    }))
  }
  updateDataPoint(){
    this.meshSenderPointModel.dataPointXid = this.dataPointXID;
    this.meshSenderPointModel.publisherXid = this.pubXid;
    this.subs.add(this._meshSenderPointService.update(this.meshSenderPointModel).subscribe((data: any)=>{
      this._commonService.notification(this.meshSenderPointModel.name +' '+this.updateSuccessMsg);
      this.getMeshSender(this.meshSenderPointModel.publisherXid);
      this.showDataPointFields = false;
    }))
  }
  edit(element: any){
    this.dataPointActions=false;
    this.showDataPointFields = true;
    this.subs.add(this._meshSenderPointService.getByXid(element.xid).subscribe((data: any)=>{
    this.meshSenderPointModel = data;
    this.subs.add(this._dataPointService.getByXid(this.meshSenderPointModel.dataPointXid).subscribe(dataPoint=>{
    this.searchDatasource = dataPoint.name + "-" + dataPoint.dataSourceName;
    this.viewDataPoint=true;
    this.dataPointXID = dataPoint.xid;
  }))
}))
  }

  removeData(element: any) {
    this.subs.add(
      this._meshSenderPointService
        .delete(element.xid)
        .subscribe((data: any) => {
          this._commonService.notification(
            element.name + " " + this.deleteSuccessMsg
          );
          this.getMeshSender(this.meshSenderPointModel.publisherXid);
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
      this.searchDatasource = selectedOption.name + "-" + selectedOption.dataSourceName;
      this.meshSenderPointModel = new MeshSenderPointModel();
    }
    }

}
