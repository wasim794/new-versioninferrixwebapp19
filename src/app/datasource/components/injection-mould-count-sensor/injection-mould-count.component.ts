import {DataSourceBase} from "../common/dataSourceBase";
import {Component, OnInit} from "@angular/core";
import {AttributeCode} from "../../model";
import {InjectionMouldCountSensorDatasourceModel, InjectionMouldCountSensorPointLocatorModel} from '../injection-mould-count-sensor';
import {InjectionMouldCountSensorDatasourceService} from '../injection-mould-count-sensor/service/injection-mould-count-sensor-datasource.service';
import {CommonService} from "../../../services/common.service";
import {DictionaryService, DataPointService} from "../../../core/services";
import {DataPointModel} from "../../../core/models/dataPoint";
import {MeshNodesDatasourceModel} from "../../model/sensors/mesh-nodes-datasource.model";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../../common/mat-module";
import { DatapointTableComponent, MeshNodesDatasourceFormComponent } from "../common";

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, MeshNodesDatasourceFormComponent, MeshNodesDatasourceFormComponent, DatapointTableComponent],
  providers: [InjectionMouldCountSensorDatasourceService, DataPointService, DictionaryService, CommonService],
  selector: 'app-injection-mould-count',
  templateUrl: './injection-mould-count.component.html'
})
export class InjectionMouldCountComponent extends DataSourceBase implements OnInit {
  public pointLocator: any = new InjectionMouldCountSensorPointLocatorModel();
  public anchorNode!: boolean;
  public visibility!: boolean;
  public attributeCode:any = new AttributeCode();
  public editPermission = [];
  public permissions = [];
  public setPermission = [];
  public readPermission = [];
  public declare datapointForm: boolean;
  public dataPointHide = false;
  public override datasource:any = new InjectionMouldCountSensorDatasourceModel();
  public dataPointModel: DataPointModel = new DataPointModel();
  public test: any;
  public messageError!: boolean;
  public UIDICTIONARY : any;
  public updateSuccess="Update successfully";
  public peoleCountError!: any[];
  private displayForm!: boolean;
  public datasourceTitleName: any;

  constructor(private dataPointService: DataPointService, public dictionaryService: DictionaryService,
              private commonService: CommonService,
              private _sensorTagDatasource: InjectionMouldCountSensorDatasourceService) {
    super();
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('core').subscribe(data=>{
   this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
   this.getPermission();
   this.setDataPointPermissions();
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
    this.datasource = datasource;
    this.datasource.anchorNode == true ? this.visibility = true : this.visibility = false;
    this.editPermission = this.datasource.editPermission.split(',');
    this.setDefaultPermission();
    this.selectTab(index);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.dataPoint.dataSourceXid = datasource.xid;
    this.getDataPoints(datasource);
    this.datasourceTitleName = datasource.name;

  }


  hideShow(event: any) {
    this.datapointForm = false;
  }
  cancel(){
    this.dataPointHide=false;
  }

  updateDatasource(xid: any) {
    this.subs.add(this._sensorTagDatasource.update(xid).subscribe(data => {
        this.datasource = data;
        this.commonService.notification(this.updateSuccess);
        this.addedUpdatedDatasource.emit(event);
      })
    );
  }
  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.pointLocator;
    this.subs.add(
      this.dataPointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.getDataPoints(this.datasource);
          this.displayForm = false;
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
          this.dataPointHide = false;
        }, error => {
          this.peoleCountError = error.result.message;
          this.timeOutFunction();
        }));
  }



  override getDataPoints(datasource: MeshNodesDatasourceModel) {
    this.datapointTableComponent.setDatapoints(datasource)
    this.setDataPointPermissions();
  }
  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.dataPointService.getByXid(dataPointXid).subscribe(data => {
        this.dataPointModel = new DataPointModel(data);
        this.pointLocator = new InjectionMouldCountSensorPointLocatorModel(this.dataPointModel.pointLocator);
        this.dataPointHide = true;

      })
    );
  }

  override addNewDatasource(dsType: any) {
    this.datasource = [];
  }


  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }


  setDefaultPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err));
  }

  onAnchorMode(event: any) {
    event.checked == true ? this.visibility = true : this.visibility = false;
  }


}

