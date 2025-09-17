import {Component, OnInit} from '@angular/core';
import {DatasourceService} from '../../../service/datasource.service';
import {CommonService} from '../../../../services/common.service';
import {DataSourceBase} from '../../common/dataSourceBase';
import {DataPointService, DictionaryService} from '../../../../core/services';
import {DataPointModel} from '../../../../core/models/dataPoint';
import {SoapDispenserDatasourceModel, SoapDispenserPointLocatorModel} from '../../mesh-node/soap-dispenser';
import {SoapDispenserDatasourceService} from './service/soap-dispenser-datasource.service';
import {TIME_PERIOD_TYPES} from "../../../../common";
import {TimePeriodModel} from "../../../../core/models/timePeriod";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
import { DatapointTableComponent } from '../../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [SoapDispenserDatasourceService, DataPointService, CommonService, DictionaryService],
  selector: 'app-soap-dispenser',
  templateUrl: './soap-dispenser.component.html'
})
export class SoapDispenserComponent extends DataSourceBase implements OnInit {
  override datapointForm: boolean=false;
  displayForm!: boolean;
  datapointButtonsView!: boolean;
  timePeriodType!: string;
  timePeriod!: number;
  public timePeriodAll: any= new TimePeriodModel();
  public dataPointModel: DataPointModel = new DataPointModel();
  public soapDatasource: any = new SoapDispenserDatasourceModel();
  public soapPointLocatorModel: any = new SoapDispenserPointLocatorModel();
  override tabIndex = 0;
  declare currentDatapointIndex: number;
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  public editPermission = [];
  public permissions = [];
  public setPermission = [];
  public readPermission = [];
  selectedProperty: any;
  dataTypes = [];
  pingDataSoureceError!:  any[];
  isEdit!: boolean;
  datasourceIsEdit!: boolean;
  dsId!: number;
  public binary = true;
  public numeric = false;
  public messageError!: boolean;
  public timePeriods = TIME_PERIOD_TYPES;
  public dataPointHide = false;
  UIDICTIONARY : any;
  datasourceTitleName:any;
  isActivePd: boolean = false;
  isActivePdSmall!:boolean;


  constructor(
    private datasourceService: DatasourceService,
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private datapointService: DataPointService,
    private PingDatasource: SoapDispenserDatasourceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getPermission();
  }

  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  saveDatasource() {
    this.pingDataSoureceError = [];
    if (this.editPermission) {
      this.soapDatasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.PingDatasource.create(this.soapDatasource)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.soapDatasource.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          this.pingDataSoureceError = error.result.message;
          this.timeOutFunction();
        }));
  }

 override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.datapointForm = true;
    this.isEdit = true;
    this.datasourceIsEdit = true;
    this.timePeriodAll = datasource.purgePeriod;
    this.subs.add(
      this.datasourceService.getDataSource(datasource.xid).subscribe(
        (data) => {
          // this.soapDatasource.timePeriod = data.purgePeriod;
          this.soapDatasource = new SoapDispenserDatasourceModel(data);
          this.dsId = data.id;
          this.editPermission = data.editPermission.split(',');
        },
        (err) => console.log(err)
      )
    );
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePd = !this.isActivePd;
    this.isActivePdSmall = true;
  }
  editDataPoint(dataPoint: any) {
    this.setDataPointPermissions();
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(
      this.datapointService
        .getByXid(dataPointXid)
        .subscribe((data) => {
          this.displayForm = true;
          this.dataPointModel = new DataPointModel(data);
          this.soapPointLocatorModel = new SoapDispenserPointLocatorModel(data.pointLocator);

          this.datapointButtonsView = true;
          this.datasourceIsEdit = true;
          this.isEdit = false;

          this.dataTypeChange(data.pointLocator.dataType);
        })
    );
  }

  overrideaddNewDatasource(dsType: any) {
    this.soapDatasource = new SoapDispenserDatasourceModel();
    this.soapDatasource.timePeriod = new TimePeriodModel();
  }
  updateDatasource() {
    this.validateTimePeriod();
    this.setDataPointPermissions();
    // this.datasource.timePeriod=this.timePeriodAll;
    console.log(this.timePeriodAll);
    this.subs.add(
      this.datasourceService.updatedataSource(this.soapDatasource).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.soapDatasource.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.pingDataSoureceError = error.result.message;
          this.timeOutFunction();
        }));
  }

  private timeOutFunction(){
    this.messageError = true;
    setTimeout(()=>{
      this.messageError = false;
    }, 10000);
  }

  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.soapPointLocatorModel;
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
          this.pingDataSoureceError = error.result.message;
          this.timeOutFunction();
        }));
  }

  validateTimePeriod() {
    if (isNaN(this.timePeriodAll.timePeriod)) {
      const prop = {
        message: 'Value must be a number',
        property: 'updatePeriods',
      };
      this.pingDataSoureceError.push(prop);
      this.timeOutFunction();
    }
  }

  dataTypeChange(dataType: string) {
    if (dataType === 'BINARY') {
      this.binary = true;
      this.numeric = false;
    } else if (dataType === 'NUMERIC') {
      this.binary = false;
      this.numeric = true;
    } else {
      this.binary = false;
      this.numeric = false;
    }
  }

  saveDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.soapPointLocatorModel;
    this.subs.add(
      this.datapointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          this.pingDataSoureceError = error.result.message;
          this.timeOutFunction();
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



  override addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.isEdit = true;
    this.selectTab(index);
    this.dataPointModel = new DataPointModel();
    this.soapPointLocatorModel = new SoapDispenserPointLocatorModel();
    this.datapointButtonsView = false;
    this.dataPointModel.dataSourceXid = xid;
    this.readPermission = [];
    this.setPermission = [];
    return true;
  }

  getPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.readPermission = data;
    }, err => console.log(err)));
  }

  cancelDataPoint() {
    this.displayForm = false;
  }


}
