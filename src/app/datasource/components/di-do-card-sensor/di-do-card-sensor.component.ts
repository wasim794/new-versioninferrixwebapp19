import {Component, OnInit} from '@angular/core';
import {DatasourceService} from '../../service/datasource.service';
import {CommonService} from '../../../services/common.service';
import {DataSourceBase} from '../common/dataSourceBase';
import {DataPointService, DictionaryService} from '../../../core/services';
import {DataPointModel} from '../../../core/models/dataPoint';
import {DidocardDatasourceModel, DidocardPointLocatorModel} from '../di-do-card-sensor';
import {DidocardDatasourceService} from '../di-do-card-sensor/service/didocard-datasource.service';
import {TIME_PERIOD_TYPES, DATA_TYPES} from "../../../common";
import {TimePeriodModel} from "../../../core/models/timePeriod";
import {AttributeCode} from "../../model/attributeCode";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [DidocardDatasourceService, DataPointService, DictionaryService],
  selector: 'app-di-do-card-sensor',
  templateUrl: './di-do-card-sensor.component.html'
})
export class DiDoCardSensorComponent extends DataSourceBase implements OnInit {
  override datapointForm: boolean=false;
  displayForm!: boolean;
  datapointButtonsView!: boolean;
  timePeriodType!: string;
  timePeriod!: number;
  public dataPointModel: DataPointModel = new DataPointModel();
  public didoDatasource: any = new DidocardDatasourceModel();
  public didoPointLocatorModel: any = new DidocardPointLocatorModel();
  override tabIndex = 0;
  declare currentDatapointIndex: number;
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  public editPermission = [];
  public permissions = [];
  public setPermission = [];
  public readPermission = [];
  selectedProperty: any;
  dataTypes = DATA_TYPES;
  thermostatDataSourcesError!:  any[];
  isEdit!: boolean;
  datasourceIsEdit!: boolean;
  dsId!: number;
  public binary = true;
  public numeric = false;
  public messageError!: boolean;
  public timePeriods = TIME_PERIOD_TYPES;
  public dataPointHide = false;
  UIDICTIONARY : any;
  attributeCode:any = new AttributeCode();
  datasourceTitleName:any;
  isActivePd: boolean = false;
  isActivePdSmall!:boolean;


  constructor(
    private datasourceService: DatasourceService,
    public  dictionaryService: DictionaryService,
    private commonService: CommonService,
    private datapointService: DataPointService,
    private thermostatservice: DidocardDatasourceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('meshConsole').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getPermission();
    this.listAttribute();
  }
  listAttribute(){
    this.subs.add(this.datapointService.getSensorExportCode('thermostat').subscribe((data: any) => {
        this.attributeCode = data;
      })
    );
  }

  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  saveDatasource() {
    this.thermostatDataSourcesError = [];
    if (this.editPermission) {
      this.didoDatasource.editPermission = this.editPermission.toString();
    }

    this.subs.add(
      this.thermostatservice.create(this.didoDatasource)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.didoDatasource.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          this.thermostatDataSourcesError = error.result.message;
          this.timeOutFunction();
        }));
  }

 override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.datapointForm = true;
    this.isEdit = true;
    this.datasourceIsEdit = true;
    this.subs.add(
      this.datasourceService.getDataSource(datasource.xid).subscribe(
        (data) => {
          this.didoDatasource = new DidocardDatasourceModel(data);
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
    this.dataPointHide = true;
    this.setDataPointPermissions();
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(
      this.datapointService
        .getByXid(dataPointXid)
        .subscribe((data) => {
          this.displayForm = true;
          this.dataPointModel = new DataPointModel(data);
          this.didoPointLocatorModel = new DidocardPointLocatorModel(this.dataPointModel.pointLocator);
          this.datapointButtonsView = true;
          this.datasourceIsEdit = true;
          this.isEdit = true;
          this.dataTypeChange(data.pointLocator.dataType);
        })
    );
  }

  override addNewDatasource(dsType: any) {
    this.didoDatasource = new DidocardDatasourceModel();
  }
  updateDatasource() {
    this.setDataPointPermissions();
    this.subs.add(
      this.thermostatservice.update(this.didoDatasource).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.didoDatasource.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.thermostatDataSourcesError = error.result.message;
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
    this.dataPointModel.pointLocator = this.didoPointLocatorModel;
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
          this.thermostatDataSourcesError = error.result.message;
          this.timeOutFunction();
        }));
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
    this.dataPointModel.pointLocator = this.didoPointLocatorModel;
    this.subs.add(
      this.datapointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          this.thermostatDataSourcesError = error.result.message;
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
    this.dataPointHide = true;
    this.isEdit = true;
    this.selectTab(index);
    this.dataPointModel = new DataPointModel();
    this.didoPointLocatorModel = new DidocardPointLocatorModel();
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

