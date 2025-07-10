import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DataPointService} from '../../../core/services';
import {CommonService} from '../../../services/common.service';
import {DataPointModel} from '../../../core/models/dataPoint';
import {DatapointPropertiesComponent} from '../common/datapoint-properties';
import {commonHelp} from "../../../help/commonHelp";
import {FormControl} from '@angular/forms';
import {DatapointTableComponent} from '../common/datapoint-table';
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {DictionaryService} from "../../../core/services/dictionary.service";
import {allPollingPeriodType, DATA_TYPES
} from "../../../common";
import {TimePeriodModel} from "../../../core/models/timePeriod";
import {SlBusDatasourceModel, SlBusPointLocatorModel, SlBusDropdownData
} from '../sl-bus';
import {SlBusDatasourceService} from './service/sl-bus-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';



@Component({
  standalone: true,
  imports: [DatapointTableComponent, CommonModule, MatModuleModule],
  providers: [DictionaryService, CommonService, SlBusDatasourceService, DataPointService],
  selector: 'app-sl-bus',
  templateUrl: './sl-bus.component.html',
  styleUrls: []
})
export class SlBusComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(DatapointPropertiesComponent, {static: true})
  private pointProperties!: DatapointPropertiesComponent;
  @ViewChild(DatapointTableComponent, {static: true})
  private datapointTableComponent!: DatapointTableComponent;
  datasource: SlBusDatasourceModel = new SlBusDatasourceModel();
  public dropDownData: SlBusDropdownData;
  permissions!: string;
  isEdit!: boolean;
  datapointButtonsView!: boolean;
  info = new commonHelp();
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  dataPoint: any = new DataPointModel();
  pointLocator = new SlBusPointLocatorModel();
  pollingPeriodType = allPollingPeriodType;
  dataTypes = DATA_TYPES;
  error: any = [];
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  dataPointModel: DataPointModel = new DataPointModel();
  read = new FormControl();
  timePeriodType = new FormControl();
  editPermission: any = [];
  public readPermission = [];
  tabIndex = 0;
  dsId!: any;
  public messageError!: boolean;
  displayForm!: boolean;
  currentDatapointIndex!: number;
  show!: boolean;
  public datapointForm: boolean = false;
  UIDICTIONARY : any;
  datasourceTitleName:any;
  isActivePd: boolean = false;
  isActivePdSmall!:boolean;


  constructor(private route: ActivatedRoute, public dictionaryService: DictionaryService, private datasourceService: SlBusDatasourceService, private router: Router,
              private commonService: CommonService, private _datapointService: DataPointService,) {
    super();
    this.dropDownData = new SlBusDropdownData(commonService);
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('core').subscribe(data=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.addPermission();
    this.dropDownData.setArrays();
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  addNewDatasource(dsType: any) {
    this.datasource = new SlBusDatasourceModel();
    this.datasource.timePeriod = new TimePeriodModel();
  }

  saveDatasource() {
    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }
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
    this.subs.add(this.datasourceService.update(this.datasource).subscribe(data => {
      this.addedUpdatedDatasource.emit(data);
      this.commonService.notification('DataSource ' + this.datasource.name + ' ' + this.updateSuccess);
    }, error => {
      this.timeOutFunction();
    }));
  }


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


   getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.subs.add(
      this.datasourceService.getByXid(datasource.xid).subscribe(
        (data) => {
          this.datasource = new SlBusDatasourceModel(data);
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
    this.isActivePd = !this.isActivePd;
    this.isActivePdSmall = true;
  }

  addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPoint = new DataPointModel();
    this.pointLocator = new SlBusPointLocatorModel();
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


  public cancel(){
    this.displayForm=false;
  }


  }


