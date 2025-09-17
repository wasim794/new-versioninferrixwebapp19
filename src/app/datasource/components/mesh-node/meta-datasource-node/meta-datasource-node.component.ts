import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DictionaryService } from "../../../../core/services";
import {DATA_TYPES} from "../../../../common";
import {DataPointModel} from "../../../../core/models/dataPoint";
import {
  MetaDsNodeDatasourceModel,
  MetaDsNodePointLocatorModel
} from "../meta-datasource-node";
import {MetaDsNodeDatasourceService} from './service/meta-ds-node-datasource.service';
import {MeshNodesDatasourceModel} from "../../../model/sensors/mesh-nodes-datasource.model";
import {CommonService} from "../../../../services/common.service";
import {DataPointService} from "../../../../core/services";
import {DataSourceBase} from "../../common/dataSourceBase";
import {BacnetIpNodePointLocatorModel} from "../bacnet-ip-node";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
import { DatapointTableComponent } from '../../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [MetaDsNodeDatasourceService, DataPointService, CommonService, DictionaryService],
  selector: 'app-meta-datasource-node',
  templateUrl: './meta-datasource-node.component.html'
})
export class MetaDatasourceNodeComponent extends  DataSourceBase implements OnInit {
  public readPermission = [];
  editPermission: any = [];
  override tabIndex = 0;
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  updateMsg = "Update successfully";
  public dataTypes = DATA_TYPES;
  public dataPointModel: DataPointModel = new DataPointModel();
  public metaDsNodeDatasourceModel:any = new MetaDsNodeDatasourceModel();
  public _metaDsNodePointLocatorModel:any = new MetaDsNodePointLocatorModel();
  public setPermission = [];
  public dataPointHide!: boolean;
  UIDICTIONARY : any;

  constructor(public dictionaryService: DictionaryService,
              private _commonService: CommonService,
              private _datapointService:DataPointService,
              private _metaDsNodeDatasourceService: MetaDsNodeDatasourceService) {
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
    this.metaDsNodeDatasourceModel = datasource;
    this.editPermission = this.metaDsNodeDatasourceModel.editPermission.split(',');
    this.setPermission = this.metaDsNodeDatasourceModel.editPermission.split(',');
    this.selectTab(index);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.dataPoint.dataSourceXid = datasource.xid;
    this.getDataPoints(datasource);
  }
  updateDatasource(){
    this.subs.add(this._metaDsNodeDatasourceService.update(this.metaDsNodeDatasourceModel).subscribe(data=>{
      this.metaDsNodeDatasourceModel = data;
      this._commonService.notification(this.metaDsNodeDatasourceModel.name+' '+ this.updateMsg);
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
        this._metaDsNodePointLocatorModel = new MetaDsNodePointLocatorModel(this.dataPointModel.pointLocator);
        this.dataPointHide = true;

      })
    );
  }
  override getDataPoints(datasource: MeshNodesDatasourceModel) {
    this.datapointTableComponent.setDatapoints(datasource);
  }

  cancelDataPoint(){
    this.dataPointHide = false;
  }
}
