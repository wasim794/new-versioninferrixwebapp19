import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList, Output, EventEmitter,
} from "@angular/core"
import {DataSourceBase} from "../../common/dataSourceBase";
import { DictionaryService } from "../../../../core/services";
import {CommonService} from "../../../../services/common.service";
import {VirtualNodeDatasourceModel, VirtualNodePointLocatorModel} from '../../mesh-node';
import {VirtualNodeDatasourceService} from './service/virtual-node-datasource.service';
import {DataPointModel} from "../../../../core/models/dataPoint";
import {DATA_TYPES} from "../../../../common";
import {DataPointService} from '../../../../core/services'
import {MeshNodesDatasourceModel} from "../../../model/sensors/mesh-nodes-datasource.model";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../../../common/mat-module";
import { DatapointTableComponent } from "../../common";


@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [VirtualNodeDatasourceService, DataPointService, CommonService, DictionaryService],
  selector: 'app-virtual-node',
  templateUrl: './virtual-node.component.html'
})
export class VirtualNodeComponent extends  DataSourceBase implements OnInit {
  public readPermission = [];
  editPermission: any = [];
  override tabIndex = 0;
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  updateMsg = "Update successfully";
  public dataTypes = DATA_TYPES;
  public dataPointModel: DataPointModel = new DataPointModel();
  public virtualNodeDatasource:any = new VirtualNodeDatasourceModel();
  public _virtualNodePointLocator:any = new VirtualNodePointLocatorModel();
  public setPermission = [];
  public dataPointHide!: boolean;
  UIDICTIONARY : any;

  constructor(public dictionaryService: DictionaryService,
              private _commonService: CommonService,
              private _datapointService:DataPointService,
              private _virtualNodeDatasource: VirtualNodeDatasourceService) {
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
    this.virtualNodeDatasource = datasource;
    this.editPermission = this.virtualNodeDatasource.editPermission.split(',');
    this.setPermission = this.virtualNodeDatasource.editPermission.split(',');
    this.selectTab(index);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.dataPoint.dataSourceXid = datasource.xid;
    this.getDataPoints(datasource);
  }

  updateDatasource(){
    this.subs.add(this._virtualNodeDatasource.update(this.virtualNodeDatasource).subscribe(data=>{
      this.virtualNodeDatasource = data;
      this._commonService.notification(this.virtualNodeDatasource.name+' '+ this.updateMsg);
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
        this._virtualNodePointLocator = new VirtualNodePointLocatorModel(this.dataPointModel.pointLocator);
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

