import {Component, OnInit} from '@angular/core';
import {DatasourceService} from '../../service/datasource.service';
import {DataSourceBase} from '../common/dataSourceBase';
import {CommonService} from '../../../services/common.service';
import {DataPointModel} from '../../../core/models/dataPoint';
import {DictionaryService} from "../../../core/services";
import {BacnetDropdownData, BacnetDataSourceModel, BacnetMSTPDatasourceService, BacnetDataPointModel} from '../banet-mstp';
import {POLLING_PERIOD_TYPE} from "../../../common";
import {BacnetService, BacnetLocalDeviceModel} from '../../../bacnet';
import { MeshNodesDatasourceModel } from '../../model/sensors/mesh-nodes-datasource.model';
import { MatModuleModule } from '../../../common/mat-module';
import { CommonModule } from '@angular/common';

@Component({
   standalone: true,
    imports: [MatModuleModule, CommonModule],
    providers: [CommonService],
  selector   : 'app-banet-mstp',
  templateUrl: './banet-mstp.component.html',
  styleUrls  : []
})
export class BanetMstpComponent extends DataSourceBase implements OnInit {
  public dropdownData              : BacnetDropdownData;
  public bacnetModel!               : BacnetLocalDeviceModel<any>[];
  public override datapointForm             : boolean=false;
  public bacnetDataPointModel      : any    = new BacnetDataPointModel();
  public dataSource                : any    = new BacnetDataSourceModel();
  public displayForm!               : boolean;
  public datapointButtonsView!      : boolean;
  public pollingPeriodType         = POLLING_PERIOD_TYPE;
  public saveSuccess               = 'saved successfully';
  public updateSuccess             = 'updated successfully';
  public readPermission            : any    = [];
  public setPermission             : any    = [];
  public dataSourceError           = [];
  public propertiesIdentifier      : any    = [];
  public selectedProperty          : any;
  public dataTypes                 = [];
  public editPermission            = [];
  public isEdit!                    : boolean;
  public objectTypes               = [];
  public setTables!                 : boolean;
  public bacnetMastpError!         : any[];
  public modelType                 = 'BACNET_MSTP.DS';
  public messageError!              : boolean;
  public UIDICTIONARY              : any;
  public datasourceTitleName       : any;
  public isActivePdSmall!           : boolean;

  constructor(  private _bacnetMSTPService  : BacnetMSTPDatasourceService,
                private datasourceService   : DatasourceService,
                public  dictionaryService   : DictionaryService,
                private _rootBacnetService  : BacnetService,
                private commonService       : CommonService) {
    super();
    this.dropdownData = new BacnetDropdownData(_bacnetMSTPService, commonService);
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.dropdownData.setArrays();
    this.getAllObjectTypes();
    this.getBacnet();
  }


  getBacnet() {
    this.subs.add(this._rootBacnetService.get().subscribe((data: BacnetLocalDeviceModel<any>[]) => {
      this.bacnetModel = data;
    }));
  }

  selectedPropertiesIdentifier(event: { source: { selected: any; }; }, property: any) {
    if (event.source.selected) {
      this.propertiesIdentifier.forEach((data: { propertyId: any; }) => {
        if (data.propertyId === property) {
          this.selectedProperty = data;
          this.dataTypes = this.selectedProperty.supportedDataTypes;
        }
      });
    }
  }
  selectedObjectType(event: { source: { selected: any; }; value: any; }) {
    if (event.source.selected) {
      this.fetchSelectedIdentifier(event.value);
      this.setValueUnderScoreString(event.value);

    }
  }

  private fetchSelectedIdentifier(objectName: any) {
    this._bacnetMSTPService.getObjectPropertiesUrl(objectName).subscribe(data => {
      this.propertiesIdentifier = data['properties'];
    });
  }


  getAllObjectTypes(){
    this._bacnetMSTPService.getObjectTypeUrl().subscribe(data => {
      this.objectTypes= data;

    });
  }

  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  // addNewDatapoint(xid: string, index: number) {
  //   if (!xid) {
  //     alert('Add datasource first');
  //     return false;
  //   }
  //   this.displayForm = true;
  //   this.selectTab(index);
  //   this.dataPoint = new DataPointModel();
  //   this.bacnetDataPointModel = new BacnetDataPointModel();
  //   this.datapointButtonsView = false;
  //   this.dataPoint.dataSourceXid = xid;

  // }

  override addNewDatasource(dsType: any) {
    this.setDefaultPermission();
  }

  setDefaultPermission() {
      this.commonService.getPermission().subscribe(data => {
      this.readPermission = data;
    }, err => console.log(err));
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
  override getDataSource(datasource: MeshNodesDatasourceModel, index: number, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.setDefaultPermission();
    // this.editPermission = datasource.editPermission.split(',');
    this._bacnetMSTPService.getByXid(datasource.xid).subscribe(data=>{
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
    this.dataSource.modelType = this.modelType;
    this.subs.add(
      this._bacnetMSTPService
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
    this.dataSource.modelType = this.modelType;
    this.subs.add(
      this._bacnetMSTPService.update(this.dataSource).subscribe(
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
        this.datapointForm = true;

        this.datapointButtonsView = true;
        this.dataPoint = data;
      this.readPermission = this.dataPoint.setPermission.split(',');
      this.setPermission = this.dataPoint.setPermission.split(',');
        // @ts-ignore
      this.bacnetDataPointModel = this.dataPoint.pointLocator;
      this.setValueUnderScoreString(this.dataPoint.pointLocator.objectTypeId);
      this.fetchSelectedIdentifier(this.dataPoint.pointLocator.objectTypeId);
      })
    );
  }

  saveDSBacnetDataPoint() {
    this.bacnetDataPointModel.modelType = 'BACNET_MSTP.PL';
    this.setWatchListPermissionToModel();
    this.dataPoint.pointLocator = this.bacnetDataPointModel;

    this.subs.add(this.datasourceService.saveDatapoint(this.dataPoint).subscribe(data => {
        this.displayForm = false;
        this.datapointButtonsView = true;
        this.dataPoint = data;
        this.datapointTableComponent.addDatapointToTable(this.dataPoint);
        this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.saveSuccess);
      }, err => {
          this.bacnetMastpError = err.result.message
          this.timeOutFunction();
      })
    );
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
      }, err => {
        this.bacnetMastpError = err.result.message
        this.timeOutFunction();
      })
    );
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  private setWatchListPermissionToModel() {
    if (this.readPermission) {
      this.dataPoint.readPermission = this.readPermission.toString();
    }
    if (this.setPermission) {
      this.dataPoint.setPermission = this.setPermission.toString();
    }
  }
  public cancel(){
  this.displayForm=false;
}
}
