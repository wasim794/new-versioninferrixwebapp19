import {Component, OnInit} from '@angular/core';
import {DatasourceService} from '../../../service/datasource.service';
import {CommonService} from '../../../../services/common.service';
import {DataSourceBase} from '../../common/dataSourceBase';
import {DataPointService, DictionaryService} from '../../../../core/services';
import {DataPointModel} from '../../../../core/models/dataPoint';
import {PaperTowelLevelDatasourceModel, PaperTowelLevelPointLocatorModel} from '../../mesh-node/paper-towel-level';
import {PaperTowelLevelDatasourceService} from './service/paper-towel-level-datasource.service';
import {TIME_PERIOD_TYPES} from "../../../../common";
import {TimePeriodModel} from "../../../../core/models/timePeriod";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
import { DatapointTableComponent } from '../../common';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [PaperTowelLevelDatasourceService, DataPointService, CommonService, DictionaryService],
  selector: 'app-paper-towel-level',
  templateUrl: './paper-towel-level.component.html'
})
export class PaperTowelLevelComponent extends DataSourceBase implements OnInit {
  override datapointForm: boolean=false;
  displayForm!: boolean;
  datapointButtonsView!: boolean;
  timePeriodType!: string;
  timePeriod!: number;
  public timePeriodAll: any= new TimePeriodModel();
  public dataPointModel: DataPointModel = new DataPointModel();
  public paperDatasource: any = new PaperTowelLevelDatasourceModel();
  public paperPointLocatorModel: any = new PaperTowelLevelPointLocatorModel();
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
  paperDataSoureceError!:  any[];
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
    private paperDatasourceService: PaperTowelLevelDatasourceService
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
    this.paperDataSoureceError = [];
    if (this.editPermission) {
      this.paperDatasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.paperDatasourceService.create(this.paperDatasource)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.paperDatasource.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          this.paperDataSoureceError = error.result.message;
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
          this.paperDatasource = new PaperTowelLevelDatasourceModel(data);
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
          this.paperPointLocatorModel = new PaperTowelLevelPointLocatorModel(data.pointLocator);

          this.datapointButtonsView = true;
          this.datasourceIsEdit = true;
          this.isEdit = false;

          this.dataTypeChange(data.pointLocator.dataType);
        })
    );
  }

  override addNewDatasource(dsType: any) {
    this.paperDatasource = new PaperTowelLevelDatasourceModel();
    this.paperDatasource.timePeriod = new TimePeriodModel();
  }
  updateDatasource() {
    this.validateTimePeriod();
    this.setDataPointPermissions();
    this.paperDatasource.purgePeriod=this.timePeriodAll;
    this.paperDatasource.editPermission = this.readPermission.toString();
    this.subs.add(
      this.datasourceService.updatedataSource(this.paperDatasource).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.paperDatasource.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.paperDataSoureceError = error.result.message;
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
    this.dataPointModel.pointLocator = this.paperPointLocatorModel;
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
          this.paperDataSoureceError = error.result.message;
          this.timeOutFunction();
        }));
  }

  validateTimePeriod() {
    if (isNaN(this.timePeriodAll.timePeriod)) {
      const prop = {
        message: 'Value must be a number',
        property: 'updatePeriods',
      };
      this.paperDataSoureceError.push(prop);
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
    this.dataPointModel.pointLocator = this.paperPointLocatorModel;
    this.subs.add(
      this.datapointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          this.paperDataSoureceError = error.result.message;
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
    this.paperPointLocatorModel = new PaperTowelLevelPointLocatorModel();
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
