import {Component, OnInit} from '@angular/core';
import {grade_Types} from '../../../common';
import {DataPointModel} from "../../../core/models/dataPoint";
import {DataSourceService} from "../../../core/services/datasource.service";
import {DictionaryService} from "../../../core/services/dictionary.service";
import {CommonService} from "../../../services/common.service";
import {DataPointService} from "../../../core/services";
import {DataSourceBase} from "../common/dataSourceBase";
import {VirtualSwitchPointLocatorModel, VirtualSwitchDatasourceModel,
  VirtualSwitchDatasourceService} from '../virtual-switch';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { DatapointTableComponent } from '../common';
import { MatModuleModule } from '../../../common/mat-module';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent],
  providers: [DataSourceService, DictionaryService, CommonService, DataPointService, VirtualSwitchDatasourceService],
  selector: 'app-virtual-switch',
  templateUrl: './virtual-switch.component.html'
})
export class VirtualSwitchComponent extends DataSourceBase implements OnInit {
  displayForm!: boolean;
  datapointButtonsView!: boolean;
  timePeriodType!: string;
  timePeriod!: number;
  public dataPointModel: DataPointModel = new DataPointModel();
  public virtualSwitchDatasource: any = new VirtualSwitchDatasourceModel();
  public virtualSwitchPointLocator: any = new VirtualSwitchPointLocatorModel();
  override tabIndex = 0;
  declare currentDatapointIndex: number;
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  public editPermission:any = [];
  public permissions = [];
  public setPermission = [];
  public readPermission = [];
  selectedProperty: any;
  dataTypes = [];
  virtualSwitchError!:any[];
  isEdit!: boolean;
  datasourceIsEdit!: boolean;
  dsId!: any;
  public binary = true;
  public numeric = false;
  gradeTypes = grade_Types;
  public dataPointHide = false;
  public messageError!: boolean;
  public declare datapointForm: boolean;
  UIDICTIONARY : any;
  isActivePdSmall!:boolean;
  public datasourceTitleName:any;

  constructor(
    private datasourceService: DataSourceService,
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private datapointService: DataPointService,
    private virtualSwitchServices: VirtualSwitchDatasourceService,
  ) {

    super();

  }


  ngOnInit(): void {
    this.getPermission();
    this.dictionaryService.getUIDictionary('core').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
  }

  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.isEdit = true;
    this.datapointForm = true;
    this.datasourceIsEdit = true;
    this.subs.add(
      this.virtualSwitchServices.getByXid(datasource.xid).subscribe(
        (data: any) => {
          this.virtualSwitchDatasource = new VirtualSwitchDatasourceModel(data);
          console.log("getvide",this.virtualSwitchDatasource);
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
        this.isActivePdSmall = true;
  }

  updateDatasource() {
    this.setDataPointPermissions();
    this.subs.add(
      this.virtualSwitchServices.update(this.virtualSwitchDatasource).subscribe(
        (data) => {
          this.addedUpdatedDatasource.emit(data);
          this.commonService.notification(
            'Datasource ' + this.virtualSwitchDatasource.name + ' ' + this.updateSuccess
          );
        }, error => {
          this.virtualSwitchError = error.result.message;
          this.timeOutFunction();
        }));
  }

  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel = this.virtualSwitchPointLocator;
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
          this.virtualSwitchError = error.result.message;
          this.timeOutFunction();
        }));
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
          this.virtualSwitchPointLocator = new VirtualSwitchPointLocatorModel(this.dataPointModel);
          this.virtualSwitchPointLocator.controlCommand = this.dataPointModel.pointLocator.controlCommand;

          this.datapointButtonsView = true;
          this.datasourceIsEdit = true;
          this.isEdit = false;
          this.dataTypeChange(data.pointLocator.dataType);
        })
    );
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

  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 3000);
  }

  override addNewDatasource(dsType: any) {
    this.virtualSwitchDatasource = new VirtualSwitchDatasourceModel();
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

  cancelDataPoint() {
    this.displayForm = false;
  }
}
