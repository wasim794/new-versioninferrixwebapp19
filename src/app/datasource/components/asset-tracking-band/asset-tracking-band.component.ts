
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {DataPointModel} from "../../../core/models/dataPoint";
import {DATA_TYPES,allPollingPeriodType} from "../../../common";
import {AttributeCode} from "../../model";
import {commonHelp} from "../../../help/commonHelp";
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {TimePeriodModel} from "../../../core/models/timePeriod";
import {DatapointTableComponent, DatapointPropertiesComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent} from '../common';
import {FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {DataPointService, DictionaryService} from '../../../core/services';
import {AssetTrackingBandDatasourceModel, AssetTrackingBandPointLocatorModel} from '../asset-tracking-band';
import {AssetTrackingBandService} from '../asset-tracking-band/service/asset-tracking-band.service';
import { MatModuleModule } from '../../../common/mat-module';
import { CommonModule } from '@angular/common';



@Component({
  standalone: true,
  imports: [MatModuleModule, CommonModule, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent, DatapointTableComponent],
  providers: [DataPointService, DictionaryService],
  selector: 'app-asset-tracking-band',
  templateUrl: './asset-tracking-band.component.html',

})

export class AssetTrackingBandComponent extends UnsubscribeOnDestroyAdapter implements  OnInit {

  @ViewChild(DatapointPropertiesComponent, {static: true})
  private pointProperties!                 : DatapointPropertiesComponent;
  @ViewChild(DatapointTableComponent,     {static: true})
  private datapointTableComponent!         : DatapointTableComponent;
  public info                             = new commonHelp();
  @Output() addedSavedDatasource          = new EventEmitter<any>();
  @Output() addedUpdatedDatasource        = new EventEmitter<any>();
  public attributeCode                    : any= new AttributeCode();
  @Output() hideShow                      = new EventEmitter<any>();
  public error                            : any = [];
  public permissions!                      : string;
  public isEdit!                           : boolean;
  public datapointButtonsView!             : boolean;
  public datasource                       : any = new AssetTrackingBandDatasourceModel();
  public pointLocator                     : any = new AssetTrackingBandPointLocatorModel();
  public saveSuccess                      = 'saved successfully';
  public updateSuccess                    = 'updated successfully';
  public editPermission: any                   = [];
  public dataTypes                        = DATA_TYPES;
  public read                             = new FormControl();
  public timePeriodType                   = new FormControl();
  public ListError                        : any;
  public pollingPeriodType                = allPollingPeriodType;
  public readPermission                   = [];
  public tabIndex                         = 0;
  public dsId!                             : any;
  public messageError!                     : boolean;
  public displayForm!                      : boolean;
  public currentDatapointIndex!            : number;
  public show!                             : boolean;
  public datapointFormName                : any;
  public dataPoint                        : any = new DataPointModel();
  public dataPointModel                   : DataPointModel   = new DataPointModel();
  public isAnchorOn!                       : boolean;
  public datapointForm                    : boolean = false;
  public UIDICTIONARY                     : any;
  public datasourceTitleName              : any;

  constructor( private route  : ActivatedRoute,
    public dictionaryService  : DictionaryService,
    private commonService     : CommonService,
    private _datapointService : DataPointService,
    private dataSources       : AssetTrackingBandService,) {
    super();

  }
  ngOnInit(){
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.addPermission();
    this.listAttribute();
  }

  listAttribute(){
    this.subs.add(this._datapointService.getSensorExportCode('student-tag').subscribe((data: any) => {
        this.attributeCode = data;
      })
    );
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  addNewDatasource(dsType:any) {
    this.datasource = new AssetTrackingBandDatasourceModel();
    this.datasource.timePeriod = new TimePeriodModel();
  }

  addPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
      this.readPermission = data;
    }, err => console.log(err));
  }

  onAnchorMode(event: any) {
    this.isAnchorOn = event.checked;
  }

  saveDatasource(){
    if (this.editPermission) this.datasource.editPermission = this.editPermission.toString();
    this.subs.add(this.dataSources.create(this.datasource).subscribe(data => {
      this.addedSavedDatasource.emit(data);
      this.commonService.notification('DataSource ' + this.datasource.name + ' ' + this.saveSuccess);
    }))
  }

  updateDatasource() {
    if (this.editPermission) this.datasource.editPermission = this.editPermission.toString();
    this.subs.add(this.dataSources.update(this.datasource).subscribe(data => {
      this.addedUpdatedDatasource.emit(data);
      this.commonService.notification('DataSource ' + this.datasource.name + ' ' + this.updateSuccess);
    }));
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.datapointFormName = true;
    this.subs.add(
      this.dataSources.getByXid(datasource.xid).subscribe(
        (data) => {
          this.datasource = new AssetTrackingBandDatasourceModel(data);
          this.dsId = data.id;
          this.editPermission = data.editPermission.split(',');
          this.datasourceTitleName = datasource.name;
        }, error => {
          this.timeOutFunction();
        }));
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
  }

  addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPoint = new DataPointModel();
    this.pointLocator = new AssetTrackingBandPointLocatorModel();
    this.datapointButtonsView = false;
    this.dataPoint.dataSourceXid = xid;
    this.readPermission = [];
    return true;
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.datapointButtonsView = true;
    this.subs.add(this._datapointService.getByXid(dataPointXid).subscribe(data => {
        this.displayForm = true;
        this.dataPoint = data;
        this.pointLocator = this.dataPoint.pointLocator;
      })
    );
  }

  getDataPoints(datasource: any) {
    this.datapointTableComponent.setDatapoints(datasource);

  }

  saveDataPoint(){
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(
      this._datapointService.create(this.dataPoint).subscribe(
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
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(
      this._datapointService.update(this.dataPoint).subscribe(
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

  private setDataPointPermissions() {
    if (this.readPermission) {
      this.dataPointModel.readPermission = this.readPermission.toString();
    }

  }

  public cancel(){
    this.displayForm=false;
  }

}


