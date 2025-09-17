import {Component, OnInit} from '@angular/core';
import {DataSourceBase} from "../common/dataSourceBase";
import {DataPointModel} from "../../../core/models/dataPoint";
import {DictionaryService} from "../../../core/services";
import {CommonService} from "../../../services/common.service";
import {DataSourceService, DataPointService} from "../../../core/services";
import {PoeLightingDatasourceModel, PoeLightingPointLocatorModel } from '../poe-lighting';
import {PoeLightingDatasourceService} from './service/poe-lighting-datasource.service';
import {MeshNodesDatasourceModel} from "../../model/sensors/mesh-nodes-datasource.model";
import {AttributeCode} from '../../model';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent } from '../common/datapoint-table';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [PoeLightingDatasourceService, DataPointService, DataSourceService, CommonService, DictionaryService],
  selector: 'app-poe-lighting',
  templateUrl: './poe-lighting.component.html'
})
export class PoeLightingComponent extends DataSourceBase implements OnInit {
  public isAnchorOn!: boolean;
  public anchorNode!: boolean;
  public visibility!: boolean;
  public attributeCode:any = new AttributeCode();
  public editPermission = [];
  public permissions = [];
  public setPermission = [];
  public readPermission = [];
  public dataPointModel: DataPointModel = new DataPointModel();
  public poelightingsDatasource: any = new PoeLightingDatasourceModel();
  public poeLightingsPointLocatorModel: any = new PoeLightingPointLocatorModel();
  public messageError!: boolean;
  public dataPointHide = false;
  private updateSuccess = 'Save Successfully';
  public peoleCountError!: any[];
  public isEdit!: boolean;
  private displayForm!: boolean;
  updateMsg="Update successfully";
  public saveSuccess   = 'saved successfully';
  UIDICTIONARY : any;
  isActivePdSmall!:boolean;
  public datasourceTitleName:any;

  constructor(
    private datasourceService: DataSourceService,
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private poeLightingDatasource:PoeLightingDatasourceService,
    private datapointService: DataPointService,) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getPermission();
    this.subs.add(this.datapointService.getSensorExportCode('people-count-camera').subscribe((data: any) => {
      this.attributeCode = data;
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

  getPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.readPermission = data;

    }, err => console.log(err)));

  }

  override getDataSource(datasource: any, index: number, editForm: any) {
    this.poelightingsDatasource = datasource;
    this.poelightingsDatasource.anchorNode == true ? this.visibility = true : this.visibility = false;
    this.editPermission = this.poelightingsDatasource.editPermission.split(',');
    this.setDefaultPermission();
    this.selectTab(index);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.dataPoint.dataSourceXid = datasource.xid;
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;
    this.isActivePdSmall = true;

  }

  saveDatasource() {
    console.log(this.poelightingsDatasource);
    if (this.editPermission) {
      this.poelightingsDatasource.editPermission = this.editPermission.toString();
    }
    this.poelightingsDatasource.timePeriod = this.poelightingsDatasource.purgePeriod;
    console.log(this.poelightingsDatasource);
    this.subs.add(
      this.poeLightingDatasource
        .create(this.poelightingsDatasource)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.poelightingsDatasource.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          // this.modbusIpError = error.result.message;
          this.timeOutFunction();
        }));
  }

  updateDatasource(xid: any) {
    this.subs.add(this.poeLightingDatasource.update(xid).subscribe(data => {
        this.poelightingsDatasource = data;
        this.commonService.notification(this.updateMsg);
        this.addedUpdatedDatasource.emit(event);
      })
    );
  }

  override addNewDatasource(dsType: any) {
    this.poelightingsDatasource = new PoeLightingDatasourceModel();
  }

  setDefaultPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err));
  }

  onAnchorMode(event: any) {
    event.checked == true ? this.visibility = true : this.visibility = false;
  }


  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.poeLightingsPointLocatorModel;
    this.subs.add(
      this.datapointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.displayForm = false;
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
          this.dataPointHide = false;
        }, error => {
          this.peoleCountError = error.result.message;
          this.timeOutFunction();
        }));
  }

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  override getDataPoints(datasource: MeshNodesDatasourceModel) {
    this.datapointTableComponent.setDatapoints(datasource)
    this.setDataPointPermissions();
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.datapointService.getByXid(dataPointXid).subscribe(data => {
        this.dataPointModel = new DataPointModel(data);
        this.poeLightingsPointLocatorModel = new PoeLightingPointLocatorModel(this.dataPointModel.pointLocator);
        this.dataPointHide = true;

      })
    );
  }

  cancel(){
    this.dataPointHide=false;
  }

}
