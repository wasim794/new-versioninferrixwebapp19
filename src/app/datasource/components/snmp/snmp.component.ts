import {DataSourceBase} from '../common/dataSourceBase';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DataPointModel} from '../../../core/models/dataPoint';
import {DataPointService} from '../../../core/services';
import {CommonService} from '../../../services/common.service';
import {TimePeriodModel} from '../../../core/models/timePeriod';
import {SnmpDropdownData, SnmpDatasourceModel, SnmpPointLocatorModel} from '../snmp';
import {SnmpDatasourceService} from  './service/snmp-datasource.service';
import {DictionaryService} from "../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent } from '../common/datapoint-table';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, ReactiveFormsModule],
  providers: [DictionaryService, CommonService, SnmpDatasourceService, DataPointService],
  selector: 'app-snmp',
  templateUrl: './snmp.component.html'
})
export class SnmpComponent extends DataSourceBase implements OnInit {
  override datapointForm: boolean = false;
  displayForm!: boolean;
  @Output() override addedSavedDatasource = new EventEmitter<any>();
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  datapointButtonsView!: boolean;
  override tabIndex = 0;
  declare currentDatapointIndex: number;
  error: any = [];
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  dsId: any;
  isEdit!: boolean;
  public dropdownData: SnmpDropdownData;
  public snmpDataSourceModel: SnmpDatasourceModel = new SnmpDatasourceModel();
  public snmpPointLocatorModel: SnmpPointLocatorModel = new SnmpPointLocatorModel();
  public dataPointModel: DataPointModel = new DataPointModel();
  public editPermission: any = [];
  public setPermission: any = [];
  public readPermission: any = [];
  public snmpV3 = false;
  public binary = true;
  public numeric = false;
  public messageError!: boolean;
  UIDICTIONARY : any;
  datasourceTitleName:any;
  isActivePdSmall! : boolean;


  constructor(
    private _datasourceService: SnmpDatasourceService,
    private _datapointService: DataPointService,
    public dictionaryService: DictionaryService,
    private _commonService: CommonService,
  ) {
    super();
    this.dropdownData = new SnmpDropdownData(_commonService);
  }

  ngOnInit(): void {
  this.dictionaryService.getUIDictionary('core').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
  });
  this.dropdownData.setArrays();

  }

  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  override addNewDatasource(dsType: any) {
    this.snmpDataSourceModel = new SnmpDatasourceModel();
    this.snmpDataSourceModel.timePeriod = new TimePeriodModel();
  }

  override addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPointModel = new DataPointModel();
    this.snmpPointLocatorModel = new SnmpPointLocatorModel();
    this.datapointButtonsView = false;
    this.dataPointModel.dataSourceXid = xid;
    this.readPermission = [];
    this.setPermission = [];
    return true;
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(
      this._datapointService
        .getByXid(dataPointXid)
        .subscribe((data) => {
          this.displayForm = true;
          this.dataPointModel = new DataPointModel(data);
          this.snmpPointLocatorModel = new SnmpPointLocatorModel(data.pointLocator);
          this.readPermission = data.readPermission.split(',');
          this.setPermission = data.setPermission.split(',');
          this.datapointButtonsView = true;
          this.dataTypeChange(data.pointLocator.dataType);
        })
    );
  }

 override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.subs.add(
      this._datasourceService.getByXid(datasource.xid).subscribe(
        (data) => {
          this.snmpDataSourceModel = new SnmpDatasourceModel(data);
          this.dsId = data.id;
          this.editPermission = data.editPermission.split(',');
        },
        (err) => console.log(err)
      )
    );
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
      this.datasourceTitleName = datasource.name;
      this.isActivePdSmall=true;
      this.getDataPoints(datasource);

  }

  saveDatasource() {
    this.error = [];
    if (this.editPermission) {
      this.snmpDataSourceModel.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this._datasourceService
        .create(this.snmpDataSourceModel)
        .subscribe((data) => {
          this.isEdit = true;
          this._commonService.notification(
            'Datasource ' + this.snmpDataSourceModel.name + ' ' + this.saveSuccess
          );

          this.addedSavedDatasource.emit(data);
        }, error => {
          this.error = error.result.message;
          this.timeOutFunction();
        }));
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  updateDatasource() {
    this.error = [];
    this.validateTimePeriod();
    if (this.editPermission) {
      this.snmpDataSourceModel.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this._datasourceService.update(this.snmpDataSourceModel).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this._commonService.notification(
            'Datasource ' + this.snmpDataSourceModel.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.error = error.result.message;
          this.timeOutFunction();
        }));
  }

  private setDataPointPermissions() {
    if (this.readPermission) {
      this.dataPointModel.readPermission = this.readPermission.toString();
    }

    if (this.setPermission) {
      this.dataPointModel.setPermission = this.setPermission.toString();
    }
  }

  updateDataPoint() {
    this.error = [];
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.snmpPointLocatorModel;
    this.subs.add(
      this._datapointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.dataPoints.data[this.currentDatapointIndex] = this.dataPoint;
          this.datapointTableComponent.dataPoints.filter = '';
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.displayForm = false;
          this._commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
        }, error => {
          this.error = error.result.message;
          this.timeOutFunction();
        }));
  }

  saveDataPoint() {
    this.setDataPointPermissions();
    this.error = [];
    this.dataPointModel.pointLocator = this.snmpPointLocatorModel;
    this.subs.add(
      this._datapointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this._commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          this.error = error.result.message;
          this.timeOutFunction();
        }));
  }

  cancelDataPoint() {
    this.displayForm = false;
  }

  validateTimePeriod() {
    this.error = [];
    if (isNaN(this.snmpDataSourceModel.timePeriod.timePeriod)) {
      const prop = {
        message: 'Value must be a number',
        property: 'updatePeriods',
      };
      this.error.push(prop);
      this._commonService.messageDisplay('errorMsg');
      return;
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

  versionChange(version: string) {
    this.snmpV3 = version === 'v3';
  }
}
