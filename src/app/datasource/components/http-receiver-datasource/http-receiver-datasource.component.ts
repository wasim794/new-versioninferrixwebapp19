import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {DataSourceBase} from '../common/dataSourceBase';
import {DataPointModel} from '../../../core/models/dataPoint';
import {DictionaryService, DataPointService} from "../../../core/services";
import {HttpReceiverModel, HttpReceiverPointLocatorModel, HttpReceiverDropdownData} from '../http-receiver-datasource';
import {HttpReceiverDatasourceService} from '../http-receiver-datasource/service/http-receiver-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [DictionaryService, HttpReceiverDatasourceService, CommonService, DataPointService],
  selector: 'app-http-receiver-datasource',
  templateUrl: './http-receiver-datasource.component.html',
  styleUrls: []
})
export class HttpReceiverDatasourceComponent extends DataSourceBase implements OnInit {
  displayForm!: boolean;
  @Output() override addedSavedDatasource   = new EventEmitter<any>();
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  datapointButtonsView!     : boolean;
  public dropdownData      : HttpReceiverDropdownData;
  public datasourceModel   : HttpReceiverModel = new HttpReceiverModel();
  public pointLocatorModel : HttpReceiverPointLocatorModel = new HttpReceiverPointLocatorModel();
  public dataPointModel    : DataPointModel = new DataPointModel();
  public editPermission:any    = [];
  public setPermission:any     = [];
  public readPermission: any    = [];
  public binary            = false;
  isEdit!: boolean;
  public messageError!      : boolean;
  public override datapointForm     : boolean=false;
  ipList:any                   = [];
  override tabIndex                 = 0;
  dsId!                    : any;
  saveSuccess              = 'saved successfully';
  updateSuccess            = 'updated successfully';
  httpReceiverError        : any = [];
  datapointFormName        : any;
  UIDICTIONARY             : any;
  datasourceTitleName      : any;
  isActivePdSmall!          : boolean;

  constructor(
    private _service          : HttpReceiverDatasourceService,
    private _commonService    : CommonService,
    private _datapointService : DataPointService,
    public dictionaryService  : DictionaryService) {
    super();
    this.dropdownData          = new HttpReceiverDropdownData(_commonService);
  }

  ngOnInit(): void {
     this.dictionaryService.getUIDictionary('httpReceiver').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.dropdownData.setArrays();
  }

  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  override addNewDatasource(dsType: any) {
    this.datasourceModel = new HttpReceiverModel();
  }

  override addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPointModel       = new DataPointModel();
    this.pointLocatorModel    = new HttpReceiverPointLocatorModel();
    this.datapointButtonsView = false;
    this.dataPointModel.dataSourceXid = xid;
    this.readPermission = [];
    this.setPermission  = [];
    return true;
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid         = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(
      this._datapointService
        .getByXid(dataPointXid)
        .subscribe((data) => {
          this.displayForm          = true;
          this.dataPointModel       = new DataPointModel(data);
          this.pointLocatorModel    = new HttpReceiverPointLocatorModel(data.pointLocator);
          this.readPermission       = data.readPermission.split(',');
          this.setPermission        = data.setPermission.split(',');
          this.dataTypeChange(data.pointLocator.dataType);
          this.datapointButtonsView = true;
        })
    );
  }

  override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.datapointForm = true;
    this.datapointFormName = true;
    this.isEdit = true;
    this.subs.add(this._service.getByXid(datasource.xid).subscribe(data => {
        this.datasourceModel = new HttpReceiverModel(data);
        this.dsId = data.id;
        this.editPermission = data.editPermission.split(',');
      }, err => console.log(err))
    );
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePdSmall = true;
  }

  saveDatasource() {
    if (this.editPermission) {
      this.datasourceModel.editPermission = this.editPermission.toString();
    }

    this.datasourceModel.purgePeriod = this.datasourceModel.purgePeriod;

    this.subs.add(
      this._service
        .create(this.datasourceModel)
        .subscribe((data) => {
          this.isEdit = true;
          this._commonService.notification(
            'Datasource ' + this.datasourceModel.name + ' ' + this.saveSuccess
          );

          this.addedSavedDatasource.emit(data);
        }, error => {
          this.httpReceiverError = error.result.message;
          this.timeOutFunction();
        }));
  }

  updateDatasource() {
    if (this.editPermission) {
      this.datasourceModel.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this._service.update(this.datasourceModel).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this._commonService.notification(
            'Datasource ' + this.datasourceModel.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.httpReceiverError = error.result.message;
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
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.pointLocatorModel;
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
          this.httpReceiverError = error.result.message;
          this.timeOutFunction();
        }));
  }

  saveDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.pointLocatorModel;
    this.subs.add(
      this._datapointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this._commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          console.log(error);
          this.httpReceiverError = error.result.message;
          this.timeOutFunction();
        }));
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  cancelDataPoint() {
    this.displayForm = false;
  }

  dataTypeChange(dataType: string) {
    this.binary = dataType === 'BINARY';
  }

  addIpToList(ip: any) {
    this.ipList.push(ip);
  }

  removeListValue(ip: any) {
  }

  addDeviceIdToList(deviceId: string) {
  }
}
