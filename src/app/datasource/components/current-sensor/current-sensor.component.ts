import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../services/common.service';
import {DataSourceBase} from '../common/dataSourceBase';
import {DataPointService, DictionaryService} from '../../../core/services';
import {DataPointModel} from '../../../core/models/dataPoint';
import {MeshNodesDatasourceModel} from "../../model/sensors/mesh-nodes-datasource.model";
import {AttributeCode} from '../../model';
import {CurrentSensorDatasourceModel, CurrentSensorPointLocatorModel} from '../current-sensor';
import {CurrentSensorDatasourceService} from '../current-sensor/service/current-sensor-datasource.service';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';

@Component({
  standalone: true,
  providers: [CurrentSensorDatasourceService, DictionaryService],
  imports: [CommonModule, MatModuleModule],
  selector: 'app-current-sensor',
  templateUrl: './current-sensor.component.html',
  styleUrls: []
})
export class CurrentSensorComponent extends DataSourceBase implements OnInit {
  public  visibility!                    : boolean;
  public  dataPointHide                 = false;
  public  editPermission                = [];
  public  permissions                   = [];
  public  setPermission                 = [];
  public  readPermission                = [];
  public  dataPointModel                : DataPointModel = new DataPointModel();
  public  currentSensorDataSource: any  = new CurrentSensorDatasourceModel();
  public  currentSensorPointLocatorModel: any = new CurrentSensorPointLocatorModel();
  public  messageError!                  : boolean;
  public  attributeCode                 : any= new AttributeCode();
  private updateSuccess                 = 'Save Successfully';
  public  currentSensorPointError!       : any[];
  private displayForm!                   : boolean;
  public  attributeCodeCurrent          : any;
  public  updateMsg                     = "Update successfully";
  public  isActivePdSmall!               : boolean;
  public  datasourceTitleName           : any;
  public  UIDICTIONARY                  : any;

  constructor(
    private datasourceService: CurrentSensorDatasourceService,
    public dictionaryService : DictionaryService,
    private commonService    : CommonService,
    private datapointService : DataPointService) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getPermission();
    this.commonExportSensor();
    this.currentExportSensor();

  }


    private commonExportSensor()
    {
      this.subs.add(this.datapointService.getSensorExportCode('current-sensor').subscribe((data: any) => {
        this.attributeCode = data;
      }));
    }

    private currentExportSensor()
    {
      this.subs.add(this.datapointService.getSensorExportCode('current-sensor/phase-ct').subscribe((data: any) => {
        this.attributeCodeCurrent = data;
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
    this.currentSensorDataSource = datasource;
    this.currentSensorDataSource.anchorNode == true ? this.visibility = true : this.visibility = false;
    this.editPermission = this.currentSensorDataSource.editPermission.split(',');
    this.setDefaultPermission();
    this.selectTab(index);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.dataPoint.dataSourceXid = datasource.xid;
    this.getDataPoints(datasource);
    this.EnableAnchorNode();
    this.datasourceTitleName = datasource.name;
    this.isActivePdSmall = true;
  }

  override addNewDatasource(dsType: any) {
    this.currentSensorDataSource = [];
    this.setDefaultPermission();
  }

  updateDatasource(xid: any) {
    this.subs.add(this.datasourceService.update(xid).subscribe(data => {
        this.currentSensorDataSource = data;
        this.commonService.notification(this.updateMsg);
        this.addedUpdatedDatasource.emit(event);
      })
    );
  }

  setDefaultPermission() {
    this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err));
  }

  onAnchorMode(event: any) {
    event.checked == true ? this.visibility = true : this.visibility = false;
  }

  EnableAnchorNode() {

  }

  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.currentSensorPointLocatorModel;
    this.subs.add(
      this.datapointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.displayForm = false;
          this.commonService.notification('Datapoint ' + this.dataPoint.name + ' ' + this.updateSuccess);
          this.dataPointHide = false;
        }, error => {
          this.currentSensorPointError = error.result.message;
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
  }

  editDataPoint(dataPoint: any) {
    const dataPointXid = dataPoint['dpXid'];
    this.currentDatapointIndex = dataPoint['index'];
    this.subs.add(this.datapointService.getByXid(dataPointXid).subscribe(data => {
        this.dataPointModel = new DataPointModel(data);
        this.currentSensorPointLocatorModel = new CurrentSensorPointLocatorModel(this.dataPointModel.pointLocator);
        this.dataPointHide = true;

      })
    );
  }

}
