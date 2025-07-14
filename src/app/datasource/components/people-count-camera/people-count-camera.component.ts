import {Component, OnInit} from '@angular/core';
import {DataSourceBase} from "../common/dataSourceBase";
import {DataPointModel} from "../../../core/models/dataPoint";
import {DictionaryService} from "../../../core/services";
import {CommonService} from "../../../services/common.service";
import {DataSourceService, DataPointService} from "../../../core/services";
import {PeopleCountCameraDatasourceService, PeopleCountCameraDatasourceModel, PeopleCountCameraPointLocatorModel } from '../people-count-camera';
import {MeshNodesDatasourceModel} from "../../model/sensors/mesh-nodes-datasource.model";
import {AttributeCode} from '../../model';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent, MeshNodesDatapointsFormComponent, MeshNodesDatasourceFormComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [PeopleCountCameraDatasourceService, DataPointService, DictionaryService, CommonService],
  selector: 'app-people-count-camera',
  templateUrl: './people-count-camera.component.html',
  styleUrls: []
})
export class PeopleCountCameraComponent extends DataSourceBase implements OnInit {
  public isAnchorOn!: boolean;
  public anchorNode!: boolean;
  public visibility!: boolean;
  public attributeCode:any = new AttributeCode();
  public editPermission = [];
  public permissions = [];
  public setPermission = [];
  public readPermission = [];
  public dataPointModel: DataPointModel = new DataPointModel();
  public peopleCountCamera: any = new PeopleCountCameraDatasourceModel();
  public peopleCountCameraPointLocatorModel: any = new PeopleCountCameraPointLocatorModel();
  public messageError!: boolean;
  public dataPointHide = false;
  private updateSuccess = 'Save Successfully';
  public peoleCountError!: any[];
  private displayForm!: boolean;
  updateMsg="Update successfully";
  UIDICTIONARY : any;
  isActivePdSmall!:boolean;
  public datasourceTitleName:any;

  constructor(
    private datasourceService: DataSourceService,
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private PeopleCountCamera:PeopleCountCameraDatasourceService,
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
    this.peopleCountCamera = datasource;
    this.peopleCountCamera.anchorNode == true ? this.visibility = true : this.visibility = false;
    this.editPermission = this.peopleCountCamera.editPermission.split(',');
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

  updateDatasource(xid: any) {
    this.subs.add(this.PeopleCountCamera.update(xid).subscribe(data => {
        this.peopleCountCamera = data;
        this.commonService.notification(this.updateMsg);
        this.addedUpdatedDatasource.emit(event);
      })
    );
  }

  override addNewDatasource(dsType: any) {
    this.peopleCountCamera = [];
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
    this.dataPointModel.pointLocator = this.peopleCountCameraPointLocatorModel;
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
        this.peopleCountCameraPointLocatorModel = new PeopleCountCameraPointLocatorModel(this.dataPointModel.pointLocator);
        this.dataPointHide = true;

      })
    );
  }

  cancel(){
    this.dataPointHide=false;
  }

}
