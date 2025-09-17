import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList, Output, EventEmitter,
} from "@angular/core"
import {DataSourceBase} from "../../common/dataSourceBase";
import { DictionaryService, DataPointService } from "../../../../core/services";
import {CommonService} from "../../../../services/common.service";
import {
  BacnetSerialNodeDatasourceModel, BacnetSerialNodePointLocatorModel} from '../../mesh-node';
import {BacnetSerialNodeDatasourceService} from './service/bacnet-serial-node-datasource.service';
import {DataPointModel} from "../../../../core/models/dataPoint";
import {DATA_TYPES} from "../../../../common";
import {MeshNodesDatasourceModel} from "../../../model/sensors/mesh-nodes-datasource.model";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../../../common/mat-module";
import { DatapointTableComponent } from "../../common";


@Component({
  standalone:true,
  imports:[CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [BacnetSerialNodeDatasourceService, DataPointService, CommonService, DictionaryService],
  selector: 'app-bacnet-serial-node',
  templateUrl: './bacnet-serial-node.component.html'
})
export class BacnetSerialNodeComponent extends  DataSourceBase implements OnInit {
  public readPermission = [];
  editPermission: any = [];
  override tabIndex = 0;
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  updateMsg = "Update successfully";
  public dataTypes = DATA_TYPES;
  public dataPointModel: DataPointModel = new DataPointModel();
  public bacnetIpNodeDatasource:any = new BacnetSerialNodeDatasourceModel();
  public _bacnetIpNodePointLocator:any = new BacnetSerialNodePointLocatorModel();
  public setPermission = [];
  public dataPointHide!: boolean;
  UIDICTIONARY : any;

  constructor(public dictionaryService: DictionaryService,
              private _commonService: CommonService,
              private _datapointService:DataPointService,
              private _bacnetIpNodeDatasource: BacnetSerialNodeDatasourceService) {
    super();
  }

  ngOnInit(): void {
  this.dictionaryService.getUIDictionary('core').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
  this.getPermission();

  }

  getPermission() {
    this.subs.add(this._commonService.getPermission().subscribe(data => {
      this.readPermission = data;

    }, err => console.log(err)));

  }
  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  override getDataSource(datasource: any, index: number, editForm: any) {
    this.bacnetIpNodeDatasource = datasource;
    this.editPermission = this.bacnetIpNodeDatasource.editPermission.split(',');
    this.setPermission = this.bacnetIpNodeDatasource.editPermission.split(',');
    this.selectTab(index);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.dataPoint.dataSourceXid = datasource.xid;
    this.getDataPoints(datasource);
  }

  updateDatasource(){
    this.subs.add(this._bacnetIpNodeDatasource.update(this.bacnetIpNodeDatasource).subscribe(data=>{
      this.bacnetIpNodeDatasource = data;
      this._commonService.notification(this.bacnetIpNodeDatasource.name+' '+ this.updateMsg);
      this.addedUpdatedDatasource.emit(event);
    }))
  }

  updateDatapoint(xid: any) {
    this.subs.add(this._datapointService.update(xid).subscribe(data => {
        this._commonService.notification(this.updateMsg);
        this.addedUpdatedDatasource.emit(event);
      })
    );
  }
  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this._datapointService.getByXid(dataPointXid).subscribe(data => {
        this.dataPointModel = new DataPointModel(data);
        this._bacnetIpNodePointLocator = new BacnetSerialNodePointLocatorModel(this.dataPointModel.pointLocator);
        this.dataPointHide = true;

      })
    );
  }
  override getDataPoints(datasource: MeshNodesDatasourceModel) {
    this.datapointTableComponent.setDatapoints(datasource)
  }

  cancelDataPoint(){
    this.dataPointHide = false;
  }

}
