import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {UnsubscribeOnDestroyAdapter} from "../../../common";
import {DatapointPropertiesComponent, DatapointTableComponent} from "../common";
import {DataPointService, DictionaryService} from '../../../core/services';
import {commonHelp} from "../../../help/commonHelp";
import {DataPointModel} from "../../../core/models/dataPoint";
import {allPollingPeriodType, DATA_TYPES} from "../../../common";
import {FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TimePeriodModel} from "../../../core/models/timePeriod";
import {HttpJsonRetrieverDatasourceModel,
        HttpJsonRetrieverPointLocatorModel,
       } from '../http-json-retriever';
import {HttpJsonRetrieverDatasourceService} from '../http-json-retriever/service/http-json-retriever-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';


@Component({
  standalone: true,
  imports : [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [DataPointService, DictionaryService, HttpJsonRetrieverDatasourceService, CommonService],
  selector: 'app-http-retriever',
  templateUrl: './http-json-retriever.component.html',
  styleUrls: []
})
export class HttpJsonRetrieverComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(DatapointPropertiesComponent, {static: true})
  private pointProperties!          : DatapointPropertiesComponent;
  @ViewChild(DatapointTableComponent, {static: true})
  private datapointTableComponent!  : DatapointTableComponent;
  datasource                       : any = new HttpJsonRetrieverDatasourceModel();
  permissions!                      : string;
  isEdit!                           : boolean;
  datapointButtonsView!             : boolean;
  info                             = new commonHelp();
  @Output() addedSavedDatasource   = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  dataPoint                        : any = new DataPointModel();
  pointLocator                     = new HttpJsonRetrieverPointLocatorModel();
  pollingPeriodType                = allPollingPeriodType;
  dataTypes                        = DATA_TYPES;
  error                            : any = [];
  saveSuccess                      = 'saved successfully';
  updateSuccess                    = 'updated successfully';
  dataPointModel                   : DataPointModel = new DataPointModel();
  read                             = new FormControl();
  timePeriodType                   = new FormControl();
  editPermission: any                   = [];
  public readPermission            = [];
  tabIndex                         = 0;
  dsId!                             : any;
  public messageError!              : boolean;
  displayForm!                      : boolean;
  datapointForm                    : boolean=false;
  currentDatapointIndex!            : number;
  show!                             : boolean;
  datapointFormName                :any;
  httpRetrieverError               : any = [];
  public bearerToken!               :boolean;
  UIDICTIONARY                     : any;
  public datasourceTitleName       :any;
  isActivePdSmall!                  :boolean;

  constructor(private route: ActivatedRoute,
              public dictionaryService : DictionaryService,
              private datasourceService: HttpJsonRetrieverDatasourceService,
              private router           : Router,
              private commonService    : CommonService,
              private dataPointService : DataPointService) {
    super();

  }

  ngOnInit() {
  this.dictionaryService.getUIDictionary('core').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
  this.addPermission();

  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  addNewDatasource(dsType: any) {
    this.datasource = new HttpJsonRetrieverDatasourceModel();
    this.datasource.timePeriod = new TimePeriodModel();
  }

  saveDatasource() {

    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }

    // this.datasource.timePeriod = this.datasource.purgePeriod;
    console.log(this.datasource);
    this.subs.add(this.datasourceService.create(this.datasource).subscribe(data => {
      this.addedSavedDatasource.emit(data);
      this.commonService.notification('DataSource ' + this.datasource.name + ' ' + this.saveSuccess);
    }, error => {
      this.timeOutFunction();
    }));
  }

  updateDatasource() {
    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }
    // this.datasource.timePeriod = this.datasource.purgePeriod;
    this.subs.add(this.datasourceService.update(this.datasource).subscribe(data => {
      this.addedUpdatedDatasource.emit(data);
      this.commonService.notification('DataSource ' + this.datasource.name + ' ' + this.updateSuccess);
    }, error => {
      this.httpRetrieverError = error.result.message;
      this.timeOutFunction();
    }));
  }

  bearerTokenToggle(event:any){
    event===true?this.bearerToken=true:this.bearerToken=false}

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  addPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
      this.readPermission = data;
    }, err => console.log(err));
  }

  getDataSource(datasource: any, index: number, editForm: any) {
    console.log(datasource);
    this.selectTab(index);
    this.datapointForm = true;
    this.isEdit = true;
    this.datapointFormName = true;
    this.subs.add(
      this.datasourceService.getByXid(datasource.xid).subscribe(
        (data) => {
          this.datasource = data;
          console.log(this.datasource);
          this.datasource.bearerAuth===true?this.bearerToken=true:this.bearerToken=false;
          this.dsId = data.id;
          this.editPermission = data.editPermission.split(',');
        }, error => {
          this.timeOutFunction();
        }));
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePdSmall = true;
  }

  addNewDatapoint(xid: any, index: number) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPoint = new DataPointModel();
    this.pointLocator = new HttpJsonRetrieverPointLocatorModel();
    this.datapointButtonsView = false;
    this.dataPoint.dataSourceXid = xid;
    this.readPermission = [];
    return true;
  }

  editDataPoint(dataPoint: { [x: string]: number; }) {

    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.datapointButtonsView = true;
    this.subs.add(this.dataPointService.getByXid(dataPointXid).subscribe(data => {
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
    this.setDataPointPermissions();
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(
      this.dataPointService.create(this.dataPoint).subscribe(
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
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(
      this.dataPointService.update(this.dataPoint).subscribe(
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

  cancelDataPoint() {
    this.displayForm = false;
  }

}
