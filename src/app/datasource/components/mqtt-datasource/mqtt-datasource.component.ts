import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DataSourceService, DataPointService, DictionaryService} from '../../../core/services';
import {mqttDataSourceService} from '../mqtt-datasource/service/mqtt-datasource.service';
import {CommonService} from '../../../services/common.service';
// import {DictionaryService} from "../../../core/services/dictionary.service";
import {UnsubscribeOnDestroyAdapter} from '../../../common';
import {DataPointModel} from '../../model';
import {
  FormControl
} from '@angular/forms';
import {PUBLISHER_TOPIC_TYPE, QOS_TYPE, SUBSCRIBERS_TOPIC_TYPE} from './shared/dropdown.data';
import {DatapointTableComponent} from "../common";
import {MeshNodesDatasourceModel} from "../../model/sensors/mesh-nodes-datasource.model";
import {DATA_TYPES} from "../../../common";
import {MqttPointLocatorModel, MqttDataSourceModel} from '../mqtt-datasource';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
   standalone: true,
    imports: [CommonModule, MatModuleModule, DatapointTableComponent],  
    providers: [mqttDataSourceService, DataSourceService, DataPointService, DictionaryService,  CommonService],
  selector: 'app-mqtt-datasource',
  templateUrl: './mqtt-datasource.component.html',
  styleUrls: []
})
export  class MqttDatasourceComponent extends UnsubscribeOnDestroyAdapter {
  @Output() addedSavedDatasource = new EventEmitter<any>();
  @Output() addedUpdatedDatasource = new EventEmitter<any>();
  @ViewChild(DatapointTableComponent, {static: true})
  public datapointTableComponent!: DatapointTableComponent;
  dataPoint: any = new DataPointModel();
  datasource: any = new MqttDataSourceModel();
  dataTypes = DATA_TYPES;
  pointLocator:any = new MqttPointLocatorModel();
  isEdit!: boolean;
  publisherTopicType= PUBLISHER_TOPIC_TYPE;
  subscriberTopicType= SUBSCRIBERS_TOPIC_TYPE;
  qosTypes=QOS_TYPE;
  currentDatapointIndex!: number;
  tabIndex = 0;
  objectTypes = [];
  setPermission = [];
  readPermission = [];
  permissions!: string;
  editPermission = [];
  public datapointForm!: boolean;
  public datapointsForm!: boolean;
  dsId!: number;
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  displayForm!: boolean;
  public messageError!: boolean;
  datapointButtonsView!: boolean;
  timePeriodType = new FormControl();
  public showCertificate!: boolean;
  mqttDatasoureError!: any[];
  public modbusSerialError: any;
  UIDICTIONARY : any;
  datasourceTitleName:any;
  isActivePd: boolean = false;
  isActivePdSmall!:boolean;

  constructor(private mqttDataSource: mqttDataSourceService ,
              private datasourceService: DataSourceService,
              private _dataPointService: DataPointService, public dictionaryService: DictionaryService, private commonService: CommonService) {
    super();
  }

  ngOnInit() {

   this.dictionaryService.getUIDictionary("mqtt").subscribe(data => {
   this.UIDICTIONARY = this.dictionaryService.uiDictionary;
       });
  }

  useCertificate(event: any) {
    this.showCertificate = event.checked;
  }

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  addNewDatasource(dsType: any) {
    this.datapointsForm = false;
    this.addPermission();
  }

  addNewDatapoint(xid: any, index: any) {

    if (!xid) {
      alert('Add datasource first');

    }
    this.displayForm = false;
    this.datapointForm = true;
    this.displayForm = true;
    this.selectTab(index);
    this.dataPoint = new DataPointModel();
    this.datapointButtonsView = false;
    this.dataPoint.dataSourceXid = xid;

  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this._dataPointService.getByXid(dataPointXid).subscribe(data => {
      this.datapointsForm = true;
      this.displayForm = true;
      this.dataPoint = data;
      this.readPermission = this.dataPoint.readPermission.split(',');
      this.setPermission = this.dataPoint.setPermission.split(',');
      this.datapointButtonsView = true;
      // @ts-ignore
      this.pointLocator = this.dataPoint.pointLocator;
    }));
  }

  private setWatchListPermissionToModel() {
    if (this.readPermission) {
      this.dataPoint.readPermission = this.readPermission.toString();
    }
    if (this.setPermission) {
      this.dataPoint.setPermission = this.setPermission.toString();
    }
  }

  validateTimePeriod() {
    if (isNaN(this.datasource.timePeriod.timePeriod)) {
      const prop = {
        'message': 'Value must be a number',
        'property': 'updatePeriods'
      };
      this.mqttDatasoureError.push(prop);
      this.timeOutFunction();
    }
  }


  addPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err));
  }

  getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.datapointsForm = true;
    this.subs.add(this.mqttDataSource.getByXid(datasource.xid).subscribe(data => {
        this.datasource = data;
        this.addPermission();
        this.dsId = this.datasource.id;
        this.editPermission = this.datasource.editPermission.split(',');
      }, err => console.log(err))
    );
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);

  }
  getDataPoints(datasource: MeshNodesDatasourceModel) {
    this.datapointTableComponent.setDatapoints(datasource);
     this.datasourceTitleName = datasource.name;
        this.isActivePd = !this.isActivePd;
        this.isActivePdSmall = true;
  }

  saveDatasource() {
    delete this.datasource.connectionDescription;
    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }

    this.subs.add(this.mqttDataSource.create(this.datasource).subscribe(data => {

      this.addedSavedDatasource.emit(data);
      this.commonService.notification('Datasource ' + this.datasource.name + ' ' + this.saveSuccess);
    }, error => {
      this.mqttDatasoureError = error.result.message;
      this.timeOutFunction();
    }));
  }


  updateDatasource() {
    if (this.editPermission) {
      this.datasource.editPermission = this.editPermission.toString();
    }
    this.subs.add(this.mqttDataSource.update(this.datasource).subscribe(data => {
      this.addedUpdatedDatasource.emit(data);
      this.commonService.notification('Datasource ' + this.datasource.name + ' ' + this.updateSuccess);
    }, error => {
      this.mqttDatasoureError = error.result.message;
      this.timeOutFunction();
    }));
  }

  private setDataPointPermissions() {
    if (this.readPermission) {
      this.dataPoint.readPermission = this.readPermission.toString();
    }

    if (this.setPermission) {
      this.dataPoint.setPermission = this.setPermission.toString();
    }
  }

  saveDataPoint() {
    this.setDataPointPermissions();
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(
      this._dataPointService.create(this.dataPoint).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
        }, error => {
          this.modbusSerialError = error.result.message;
          this.timeOutFunction();
        }));
  }


  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPoint.pointLocator = this.pointLocator;
    this.subs.add(
      this._dataPointService.update(this.dataPoint).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
        }, error => {
          this.modbusSerialError = error.result.message;
          this.timeOutFunction();
        }));
  }



  cancelDataPoint() {
    this.displayForm = false;
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }


}
