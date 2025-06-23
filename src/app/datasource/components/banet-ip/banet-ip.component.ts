import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatasourceService} from '../../service/datasource.service';
import {DataSourceBase} from '../common/dataSourceBase';
import {DataPointModel} from '../../../core/models/dataPoint';
import {CommonService} from '../../../services/common.service';
import {BacnetDropdownData, BacnetDatasourceService, BacnetIPDataSourceModel} from '../banet-ip';
import {BacnetDataPointModel} from '../banet-mstp';
import {DictionaryService} from "../../../core/services";
import {BacnetService, BacnetLocalDeviceModel} from '../../../bacnet';
import {POLLING_PERIOD_TYPE} from "../../../common";
import { MeshNodesDatasourceModel } from '../../model/sensors/mesh-nodes-datasource.model';
import { MatModuleModule } from '../../../common/mat-module';
import {DatapointTableComponent} from '../common/datapoint-table';


@Component({
  standalone: true,
  imports: [MatModuleModule, CommonModule, DatapointTableComponent],
  providers: [CommonService],
  selector: 'app-banet-ip',
  templateUrl: './banet-ip.component.html',
  styleUrls: []
})
export class BanetIpComponent extends DataSourceBase implements OnInit {
  override datapointForm              : boolean=false;
  public dropdownData        : BacnetDropdownData;
  displayForm: boolean = false;
  datapointButtonsView: boolean = false;
  override dataPoint                  : any = new DataPointModel();
  bacnetDataPointModel       : any = new BacnetDataPointModel();
  dataSource                 : any = new BacnetIPDataSourceModel();
  bacnetModel!: BacnetLocalDeviceModel<any>[];
  override tabIndex                   = 0;
  declare currentDatapointIndex      : number;
  saveSuccess                = 'saved successfully';
  updateSuccess              = 'updated successfully';
  readPermission             = [];
  setTables                  : boolean | undefined;
  editPermission             : any = [];
  isEdit                     : boolean | undefined;
  setPermission              = [];
  propertiesIdentifier:any       = [];
  selectedProperty           : any;
  dataTypes:any                  = [];
  dataSourceError            : any[] | undefined;
  bacNetIpPointError         : any[] | undefined;
  public messageError        : boolean | undefined;
  public objectType          : any= [];
  pollingPeriodType          = POLLING_PERIOD_TYPE;
  UIDICTIONARY               : any;
  isActivePdSmall            : boolean | undefined;
  public datasourceTitleName : any;

  constructor(private bacnetDataSource  : BacnetDatasourceService,
              private datasourceService : DatasourceService,
              private _rootBacnetService: BacnetService,
              public dictionaryService  : DictionaryService,
              private commonService     : CommonService) {
    super();
    this.dropdownData = new BacnetDropdownData(bacnetDataSource, commonService);
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.dropdownData.setArrays();
    this.getAllObjectTypes();
   this.getBacnet();
  }


  selectedObjectType(event: { source: { selected: any; }; value: any; }) {
    if (event.source.selected) {
        this.fetchSelectedIdentifier(event.value);
        this.setValueUnderScoreString(event.value);
    }
  }

  setValueUnderScoreString(event: any){
    const stringValue_ = this.getTextAfterUnderscore(event);
    if(stringValue_=='VALUE' || stringValue_=='OUTPUT'){
      this.setTables=true;
    }else{
      this.setTables=false;
    }
  }

  getTextAfterUnderscore(inputString: string) {
    const parts = inputString.split('_');
    if (parts.length > 1) {
      return parts[1]; // Text after the underscore
    }
    return ''; // Return an empty string if there's no underscore
  }



  private fetchSelectedIdentifier(objectName: any) {
    this.bacnetDataSource.getObjectPropertiesUrl(objectName).subscribe(data => {
      this.propertiesIdentifier = data.properties;
      console.log(this.propertiesIdentifier);
    });
  }

  getAllObjectTypes(){
    this.bacnetDataSource.getObjectTypeUrl().subscribe(data => {
      this.objectType= data;
    });
  }

  getBacnet() {
    this.subs.add(this._rootBacnetService.get().subscribe(data => {
      this.bacnetModel = data;
    }));
  }
  selectedPropertiesIdentifier(event: any, property: any) {
    if (event.source.selected) {
      this.propertiesIdentifier.forEach((data: any) => {
        if (data.propertyId === property.propertyId) {
          this.selectedProperty = data;
          this.dataTypes = this.selectedProperty.supportedDataTypes;
        }
      });
    }
  }

  override selectTab(index: number): void {
    this.tabIndex = index;
  }


   override addNewDatapoint(xid: string, index: number): boolean { // Explicitly declare return type
    if (!xid) {
      alert('Add datasource first');
      return false;
    }
    this.displayForm = true;
    this.selectTab(index);
    this.dataPoint = new DataPointModel();
    this.bacnetDataPointModel = new BacnetDataPointModel();
    this.datapointButtonsView = false;
    this.dataPoint.dataSourceXid = xid;
    return true; // <--- Add a return value for this path
}

  override addNewDatasource(dsType: any) {
    this.setDefaultPermission();
  }

  setDefaultPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.readPermission = data;
    }, err => console.log(err));
  }

  override getDataSource(datasource: MeshNodesDatasourceModel, index: number, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.setDefaultPermission();
      this.editPermission = datasource.editPermission.split(',');
      this.bacnetDataSource.getByXid(datasource.xid).subscribe(data=>{
        this.dataSource = data;
      })

    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePdSmall = true;
  }

  saveDatasource() {
    if (this.editPermission) {
      this.dataSource.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.bacnetDataSource
        .create(this.dataSource)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.dataSource.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          this.dataSourceError = error.result.message;
          this.timeOutFunction();
        }));
  }

  updateDatasource() {
    if (this.editPermission) {
      this.dataSource.editPermission = this.editPermission.toString();
    }
    this.subs.add(
      this.bacnetDataSource.update(this.dataSource).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.dataSource.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.dataSourceError = error.result.message;
          this.timeOutFunction();
        }));
  }
  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.datasourceService.getDataPointDetails(dataPointXid).subscribe(data => {
        this.displayForm = true;
        this.dataPoint = data;
        this.readPermission = this.dataPoint.readPermission.split(',');
        this.setPermission = this.dataPoint.setPermission.split(',');
        this.datapointButtonsView = true;
        // @ts-ignore
        this.bacnetDataPointModel = this.dataPoint.pointLocator;
      this.setValueUnderScoreString(this.dataPoint.pointLocator.objectTypeId);
      this.fetchSelectedIdentifier(this.dataPoint.pointLocator.objectTypeId);
      })
    );
  }

  saveDSBacnetDataPoint() {
    this.bacnetDataPointModel.modelType = 'BACNET_IP.PL';
    this.setWatchListPermissionToModel();
    this.dataPoint.pointLocator = this.bacnetDataPointModel;
    this.subs.add(this.datasourceService.saveDatapoint(this.dataPoint).subscribe(data => {
        this.displayForm = false;
        this.datapointButtonsView = true;
        this.dataPoint = data;
        this.datapointTableComponent.addDatapointToTable(this.dataPoint);
        this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
      }, error => {
        this.bacNetIpPointError = error.result.message;
        this.timeOutFunction();
      })
    );
  }

  cancelDataPoint() {
    this.displayForm = false;
  }

  updateDSBacnetDataPoint() {
    this.bacnetDataPointModel.modelType = 'BACNET_IP.PL';
    this.setWatchListPermissionToModel();
    this.dataPoint.pointLocator = this.bacnetDataPointModel;
    this.subs.add(this.datasourceService.updateDataPoint(this.dataPoint).subscribe(data => {
        this.displayForm = false;
        this.datapointButtonsView = true;
        this.dataPoint = data;
        this.datapointTableComponent.dataPoints.data[this.currentDatapointIndex] = this.dataPoint;
        this.datapointTableComponent.dataPoints.filter = '';
        this.datapointTableComponent.updatedData(this.dataPoint.xid);
        this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
      }, error => {
        this.bacNetIpPointError = error.result.message;
      this.timeOutFunction();
      })
    );
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    },  3000);
  }


  private setWatchListPermissionToModel() {
    if (this.readPermission) {
      this.dataPoint.readPermission = this.readPermission.toString();
    }
    if (this.setPermission) {
      this.dataPoint.setPermission = this.setPermission.toString();
    }
  }
}
