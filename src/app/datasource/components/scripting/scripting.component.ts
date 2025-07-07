import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DictionaryService } from "../../../core/services";
import { CommonService } from "../../../services/common.service";
import { ScriptingDatasourceModel } from "./models/scripting-datasource.model";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScriptingPointLocatorModel } from "./models/scripting-point-locator.model";
import {
  ContextUpdateEvent,
  DATA_TYPES, TIME_PERIOD_TYPES, updateEvents
} from "../../../common";

import { DataPointModel } from "../../../core/models/dataPoint";
import { TimePeriodModel } from "../../../core/models/timePeriod";
import {
  DataPointService, ScriptsService, DataSourceService,
  ScriptUtilsService,
} from "../../../core/services";
import { ScriptingDatasourceService } from "./service/scripting-datasource.service";
import { LogLevel } from "../../../core/models/scripts";
import { DataSourceBase } from "../common/dataSourceBase";
import { StackJavascriptModel } from "../../../core/models/scripts";
import { ScriptingDialogComponent } from './scripting-dialog/scripting-dialog.component';
import { MatDialog } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';
import { DatapointTableComponent } from '../common';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, DatapointTableComponent, ReactiveFormsModule],
  providers: [DictionaryService, CommonService, ScriptingDatasourceService, DataPointService],
  selector: 'app-scripting',
  templateUrl: './scripting.component.html',
  styleUrls: []
})
export class ScriptingComponent extends DataSourceBase implements OnInit {
  @Output() override addedSavedDatasource = new EventEmitter<any>();
  @Output() override addedUpdatedDatasource = new EventEmitter<any>();
  public anchorNode!: boolean;
  public visibility!: boolean;
  public editPermission: any = [];
  public stackJavascriptModel: any = {} as StackJavascriptModel;
  public scriptPermission = [];
  public ErrorMsg: any;
  public isEdit!: boolean;
  public displayForm!: boolean;
  public messageError!: boolean;
  public permissions = [];
  public binary = false;
  public numeric = false;
  public dataTypes = DATA_TYPES;
  public setPermission: any = [];
  public readPermission: any = [];
  public timePeriods = TIME_PERIOD_TYPES;
  public scriptingDatasource: any = new ScriptingDatasourceModel();
  public dataPointModel: DataPointModel = new DataPointModel();
  public scriptingPointLocateModel: any = new ScriptingPointLocatorModel();
  public datasourceIsEdit!: boolean;
  public dataPointHide!: boolean;
  public dsId!: any;
  public datapointButtonsView!: boolean;
  saveSuccess = 'saved successfully';
  updateSuccess = 'updated successfully';
  public updateEvents = ContextUpdateEvent;
  public pollingHide: boolean = false;
  logLevels = LogLevel;
  items: any[] = [];
  selectedItems: any[] = [];
  selectedItemsControl: any = new FormControl([]);
  searchControl = new FormControl('');
  public dataTableHide: boolean = false;
  override tabIndex = 0;
  public scriptError: any = [];
  public buttonViews!: boolean;
  public override datapointForm: boolean = false;
  UIDICTIONARY: any;
  totoalDatapoints!: number;
  datasourceTitleName: any;
  filteredItemss: any;
  filteredItemListing: any[] = [];
  public existingDataPoint: any[] = [];
  isActivePd: boolean = false;
  isActiveColor: boolean = false;
  isActivePdSmall!: boolean;
  limit = 10;
  offset = 0;
  public dataSourceError!: any[];

  constructor(
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private dataPointService: DataPointService,
    private scriptingDatasourceService: ScriptingDatasourceService,
    private scriptUtilsService: ScriptUtilsService,
    public dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('core').subscribe(data => {
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.getPermission();
    this.getDataPointsAll(this.limit, this.offset);
  }

  isSelected(itemId: any): boolean {
    return this.selectedItems.includes(itemId);
  }
  override selectTab(index: number): void {
    this.tabIndex = index;
  }

  getConditions() {
    if (this.selectedItems.length === 0) {
      this.dataTableHide = false;
    } else {
      this.dataTableHide = true;
    }
  }

  saveDatasource() {
    this.ErrorMsg = [];
    if (this.editPermission) {
      this.scriptingDatasource.editPermission = this.editPermission.toString();
    }
    if (this.scriptPermission) {
      this.scriptingDatasource.scriptPermissions = this.editPermission.toString();

    }

    this.scriptingDatasource.purgePeriod;
    this.scriptingDatasource.modelType = "SCRIPTING.DS";
    this.subs.add(
      this.scriptingDatasourceService.create(this.scriptingDatasource)
        .subscribe((data) => {
          this.isEdit = true;
          this.commonService.notification(
            'Datasource ' + this.scriptingDatasource.name + ' ' + this.saveSuccess
          );
          this.addedSavedDatasource.emit(data);
        }, error => {
          this.dataSourceError = error.result.message;
          this.timeOutFunction();
        }));
  }

  private getDataPointsAll(limit: any, offset: any) {
    const param = "limit(" + limit + "," + offset + ")";
    this.subs.add(
      this.dataPointService.get(param).subscribe((data) => {
        this.totoalDatapoints = this.dataPointService.total;
        this.items = data;
        this.filteredItemss = this.items;
        this.filteredItemListing = this.items;
      })
    );
  }

  dataPointLists(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (!inputValue || inputValue.trim() === "") {
      this.getDataPointsAll(this.limit, this.offset);
    }
    if (inputValue) {
      this.getDefaultDataList(inputValue);
    } else {
      this.filteredItemListing = this.existingDataPoint;
    }
  }
  private getDefaultDataList(inputValue?: any) {
    const param = "limit(" + this.limit + "," + this.offset + ")";
    let params = param + "&like(name,%2A" + inputValue + "%2A)";
    this.subs.add(
      this.dataPointService.get(params).subscribe((data) => {
        this.filteredItemListing = data;
      })
    );
  }

  private getDataByXID(XID: any) {
    this.dataPointService.getByXid(XID).subscribe((data) => {
      this.filteredItemListing.push(data);
    });
  }

  onSelectionChange(event: any) {
    let xid;
    this.selectedItemsControl.value.forEach((item: any) => {
      xid = item;
    });
    const dialogRef = this.dialog.open(ScriptingDialogComponent, {
      data: {
        action: "add",
        datapointValue: xid,
        allDataPoints: this.scriptingDatasource.context,
      },
      width: "900px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null && result !== undefined && isValid(result)) {
        this.scriptingDatasource.context = result;
        this.buttonViews = true;
      }
    });

    function isValid(data: any): boolean {
      return true;
    }
  }
  viewSelectedItems() {
    const dialogRef = this.dialog.open(ScriptingDialogComponent, {
      data: {
        action: "view",
        allDataPoints: this.scriptingDatasource.context,
      },
      width: "900px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.scriptingDatasource.context = result;
      this.buttonViews = true;
    });
  }

  override getDataSource(datasource: any, index: any, editForm: any) {
    this.selectTab(index);
    this.datapointForm = true;
    this.isEdit = true;
    this.datasourceIsEdit = true;
    this.subs.add(
      this.scriptingDatasourceService.getByXid(datasource.xid).subscribe(
        (data) => {
          this.scriptingDatasource = new ScriptingDatasourceModel(data);
          this.dsId = data.id;
          this.scriptingDatasource.context.map((item: any) => {
            item.xid;
            this.getDataByXID(item.xid);
          });
          const xidValuess = this.scriptingDatasource.context.map(
            (item: any) => item.xid
          );
          this.selectedItems = xidValuess;
          this.isSelected(this.selectedItems);
          this.buttonViews = true;
          this.editPermission = data.editPermission.split(',');
          this.scriptPermission =
            this.scriptingDatasource.editPermission.split(",");
        },
        (err) => console.log(err)
      )
    );
    this.onPollingChange(datasource.polling);
    if (editForm) {
      this.addNewDatapoint(datasource.xid, index);
    }
    this.datasourceTitleName = datasource.name;
    this.isActivePdSmall = true;
    this.getDataPoints(datasource);
    this.isActivePd = !this.isActivePd;

  }

  onPollingChange(event: any) {


  }

  validateScript() {

    this.stackJavascriptModel.permissions = this.scriptingDatasource.editPermission;
    this.stackJavascriptModel.script = this.scriptingDatasource.script;
    this.stackJavascriptModel.wrapInFunction = false;
    this.stackJavascriptModel.context = this.scriptingPointLocateModel.context;
    this.stackJavascriptModel.logLevel = this.scriptingPointLocateModel.logLevel;
    this.stackJavascriptModel.resultDataType = this.scriptingPointLocateModel.dataType;

    this.subs.add(
      this.scriptingDatasourceService
        .validateScript(this.scriptingDatasource.xid, this.stackJavascriptModel)
        .subscribe((data) => {
          this.isActiveColor = !this.isActiveColor;
          this.scriptError = data.result;
          this.messageError = true;
          this.timeOutFunction();

        },
          (error) => {
            this.scriptError = error.result.message;
            this.messageError = true;
            this.timeOutFunction();
          })
    );
  }

  override addNewDatasource(dsType: any) {
    this.scriptingDatasource = {} as ScriptingDatasourceModel;
    this.scriptingDatasource.timePeriod = new TimePeriodModel();
    this.editPermission = [];
    this.scriptPermission = [];
  }
  updateDatasource() {
    this.setDatasourcePermissions();
    this.subs.add(
      this.scriptingDatasourceService.update(this.scriptingDatasource).subscribe(
        (data) => {
          this.commonService.notification(
            'Datasource ' + this.scriptingDatasource.name + ' ' + this.updateSuccess
          );
          this.addedUpdatedDatasource.emit(data);
        }, error => {
          this.ErrorMsg = error.result.message;
          this.timeOutFunction();
        }));
  }


  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }



  editDataPoint(dataPoint: any) {
    this.setDataPointPermissions();
    const dataPointXid = dataPoint["dpXid"];
    this.currentDatapointIndex = dataPoint["index"];
    this.subs.add(
      this.dataPointService.getByXid(dataPointXid).subscribe((data) => {

        this.displayForm = true;
        this.dataPointModel = new DataPointModel(data);
        this.scriptingPointLocateModel = data.pointLocator;
        this.datapointButtonsView = true;
        this.datasourceIsEdit = true;
        this.isEdit = false;
        this.dataPointHide = true;
        this.readPermission = data.readPermission.split(",");
        this.setPermission = data.setPermission.split(",");

        this.dataTypeChange(data.pointLocator.dataType);
      })
    );
  }


  updateDataPoint() {
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.scriptingPointLocateModel;
    this.subs.add(
      this.dataPointService.update(this.dataPointModel).subscribe(
        (data) => {
          this.dataPoint = data;
          this.datapointTableComponent.dataPoints.data[
            this.currentDatapointIndex
          ] = this.dataPoint;
          this.datapointTableComponent.dataPoints.filter = "";
          this.datapointTableComponent.updatedData(this.dataPoint.xid);
          this.displayForm = false;
          this.commonService.notification(
            "Datapoint " + this.dataPoint.name + " " + this.updateSuccess
          );
          this.dataPointHide = false;
          this.addedUpdatedDatasource.emit(data);
        },
        (error) => {
          this.ErrorMsg = error.result.message;
          this.timeOutFunction();
        }
      )
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

  saveDataPoint() {
    this.scriptingPointLocateModel.modelType = "SCRIPTING.PL";
    this.setDataPointPermissions();
    this.dataPointModel.pointLocator = this.scriptingPointLocateModel;
    this.subs.add(
      this.dataPointService.create(this.dataPointModel).subscribe(
        (data) => {
          this.datapointButtonsView = true;
          this.dataPoint = data;
          this.displayForm = false;
          this.datapointTableComponent.addDatapointToTable(this.dataPoint);
          this.commonService.notification(
            "Datapoint " + this.dataPoint.name + " " + this.saveSuccess
          );
          this.dataPointHide = false;
        },
        (error) => {
          this.ErrorMsg = error.result.message;
          this.timeOutFunction();
        }
      )
    );
  }


  // get filteredItems(): any[] {
  //   this.getConditions();
  //   const search = this.searchControl.value.toLowerCase();
  //   return this.items.filter((item) =>
  //     item.extendedName.toLowerCase().includes(search)
  //   );
  //
  // }

  private setDatasourcePermissions() {
    if (this.readPermission) {
      this.scriptingDatasource.readPermission = this.readPermission.toString();
    }
    if (this.scriptPermission) {
      this.scriptingDatasource.scriptPermissions = this.readPermission.toString();
    }
  }

  private setDataPointPermissions() {
    if (this.readPermission) {
      this.dataPointModel.readPermission = this.readPermission.toString();
    }

  }

  override addNewDatapoint(xid: any, index: any) {
    if (!xid) {
      alert("Add datasource first");
      return false;
    }
    this.displayForm = true;
    this.dataPointHide = true;
    this.isEdit = true;
    this.selectTab(index);
    this.dataPointModel = new DataPointModel();
    this.datapointButtonsView = false;
    this.dataPointModel.dataSourceXid = xid;
    this.readPermission = [];
    this.getPermission();
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
