import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataSourceBase} from "../common/dataSourceBase";
import {DataPointModel} from "../../../core/models/dataPoint";
import {DictionaryService} from "../../../core/services/dictionary.service";
import {CommonService} from "../../../services/common.service";
import {DataSourceService, DataPointService} from "../../../core/services";
import {MeshNodesDatasourceModel} from "../../model/sensors/mesh-nodes-datasource.model";
import {AttributeCode} from '../../model/attributeCode';
import {
  OpcDatasourceModel,
  OpcPointLocatorModel,
  OpcListServersRequestModel,
  OpcListTagsRequestModel
} from '../opc-da';

import {OpcDatasourceService}  from './service/opc-datasource.service';
import {MatDialog} from "@angular/material/dialog";
import { DatapointTableComponent } from '../common';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';


@Component({
  standalone: true,
  imports: [DatapointTableComponent, CommonModule, MatModuleModule],
  providers: [DictionaryService, CommonService, OpcDatasourceService, DataPointService],
  selector: 'app-opc-da',
  templateUrl: './opc-da.component.html'
})
export class OpcDaComponent extends DataSourceBase implements OnInit {
  public OpcDatasource:any = new OpcDatasourceModel();
  private OpcListServers: any = new OpcListServersRequestModel();
  public OpcPointLocator:any = new OpcPointLocatorModel();
  @Output() override  addedSavedDatasource = new EventEmitter<any>();
  @Output() override  addedUpdatedDatasource = new EventEmitter<any>();
  datapointButtonsView!: boolean;
  public anchorNode!: boolean;
  public visibility!: boolean;
  public attributeCode:any = new AttributeCode();
  public editPermission = [];
  public permissions = [];
  public setPermission = [];
  public readPermission = [];
  public dataPointModel: DataPointModel = new DataPointModel();
  public messageError!: boolean;
  public dataPointHide = false;
  public peoleCountError!: any[];
  public serverListArray!: any[];
  public tagListArray! : any[];
  private displayForm!: boolean;
  public saveSuccess   = 'saved successfully';
  private updateSuccess = 'Save Successfully';
  public isEdit!: boolean;
  UIDICTIONARY : any;

  constructor(
    private datasourceService: DataSourceService,
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private OpcDataSource: OpcDatasourceService,
    private datapointService: DataPointService,
    private dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.getPermission();
    this.dictionaryService.getUIDictionary('opcda').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.subs.add(this.datapointService.getSensorExportCode('people-count-camera').subscribe((data: any) => {
      this.attributeCode = data;
    }));
  }

  private setDataPointPermissions() {
    if (this.readPermission) {
      this.dataPointModel.readPermission = this.readPermission.toString();
    }
    if (this.setPermission) {
      this.dataPointModel.setPermission = this.readPermission.toString();
    }
  }

  getPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.readPermission = data;

    }, err => console.log(err)));

  }


  getListTags(model: any){
    this.tagListArray = model;
    this.subs.add(this.OpcDataSource.listTags(model).subscribe(data=>{
      this.tagListArray = model;
    }, err=> console.log(err)));
  }

  saveDatasource(){
    if (this.editPermission) {
      this.OpcDatasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.OpcDataSource
        .create(this.OpcDatasource)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.OpcDatasource.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          console.log('error in modbus-serial while saving ' + JSON.stringify(error));
          this.timeOutFunction();
        }));
  }

  updateDatasource(){
    if (this.editPermission) {
      this.OpcDatasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.OpcDataSource.update(this.OpcDatasource).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.OpcDatasource.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.timeOutFunction();
        }));
  }
  reloadServerList(model?: OpcListServersRequestModel){
    this.OpcListServers = this.OpcDatasource;
    this.getListTags(this.serverListArray);
    this.subs.add(this.OpcDataSource.listServers(this.OpcDatasource).subscribe(data=>{
      this.serverListArray = data;
    }, err => console.log(err)));
  }

  setDefaultPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err));
  }

  onAnchorMode(event: any) {
    event.checked == true ? this.visibility = true : this.visibility = false;
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  override getDataPoints(datasource: MeshNodesDatasourceModel) {
    this.datapointTableComponent.setDatapoints(datasource)
    this.setDataPointPermissions();
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.datapointService.getByXid(dataPointXid).subscribe(data => {
        this.dataPointModel = new DataPointModel(data);
        this.OpcPointLocator = new OpcPointLocatorModel(this.dataPointModel.pointLocator);
        this.dataPointHide = true;

      })
    );
  }

  saveDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.OpcPointLocator;
    this.subs.add(
      this.datapointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          this.timeOutFunction();
        }));
  }

  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.OpcPointLocator;
    this.subs.add(
      this.datapointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.dataPoints.data[this.currentDatapointIndex] = this.dataPoint;
          this.datapointTableComponent.dataPoints.filter = '';
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.displayForm = false;
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
        }, error => {

          this.timeOutFunction();
        }));
  }

  cancelDataPoint() {
    this.displayForm = false;
  }

}
