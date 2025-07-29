import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DataSourceService, DataPointService} from '../../core/services';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonService} from '../../services/common.service';
import {DataPoint} from '../model/dataPoint';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DatasourceModel} from '../../datasource/model/datasourceModel';
import {SelectionModel} from '@angular/cdk/collections';
import {DataPointModel} from '../../datasource/model/dataPointModel';
import {UnsubscribeOnDestroyAdapter} from '../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../../core/services/dictionary.service";

export interface PermissionDialogData {
  datasource: DatasourceModel;
}

@Component({
  selector: 'app-permission-datapoint-dailog',
  templateUrl: './permission-datapoint-dailog.component.html',
  styleUrls: []
})
export class PermissionDatapointDailogComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  searchDataPoint: string;
  private selectedDatasourceId: number;
  dataPoints: any;
  private errorMsg: any;
  private limit = 10;
  private offset = 0;
  private dataPointTotalPages: number;
  private selectedDataPointsXid: any[] = [];
  private editPermissionGroupArray: any[] = [];
  toPermissionGroupsArray: any[] = [];
  private permissions: string;
  private permissionError = [];
  permissionReadError = [];
  enableGroupPermission: boolean;
  permissionSetError = [];
  readSelectedPermissions: any[];
  setSelectedPermissions: any[];
  tableColumns = ['Select', 'Datapoint', 'Read Permission', 'Set Permission'];
  selection = new SelectionModel<DataPointModel>(true, []);
  private dataSource: any;
  private checkedDataPoints = [];
  private readPermissionMessage = 'Read Permission Applied Successfully';
  private setPermissionMessage = 'Set Permission Applied Successfully';
  private durationInSeconds = 5;
  public messageError: boolean;
  UIDICTIONARY : any;

  constructor(private _dataSource: DataSourceService,
             private _dataPoint: DataPointService, private dialog: MatDialog, private commonService: CommonService, @Inject(MAT_DIALOG_DATA) public data: PermissionDialogData, public dialogRef: MatDialogRef<PermissionDatapointDailogComponent>, public snackBar: MatSnackBar, public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('permissions').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.selectedDatasourceId = this.data.datasource.id;
    this.getDataPoint();
  }

  getDataPoint(){
    this.toPermissionGroupsArray = [];
    this.editPermissionGroupArray = [];
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPointList(param);
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
      this.editPermissionGroupArray.push(this.permissions);
      this.toPermissionGroupsArray.push(this.permissions)
      if (this.permissions) {
        const ar = this.permissions.toString().split(','); // split string on comma
        for (let i = 0; i < ar.length; i++) {
          this.toPermissionGroupsArray.push((ar[i]));
        }
      }
      // remove groups from permissions string, which groups are already present in edit permission group
      this.editPermissionGroupArray.forEach(editPermissionGroup => {
        this.toPermissionGroupsArray = this.toPermissionGroupsArray.filter(item => item !== editPermissionGroup);
      });
    }, err => console.log(err)));
  }

  setPermission() {
    this.selectedDataPoints();
    const setPermissionBody = {
      'xids': this.selectedDataPointsXid,
      'groups': this.setSelectedPermissions.toString()
    };
    this.subs.add(this._dataPoint.BulkSetPermissionUpdateDataPoints(setPermissionBody).subscribe(data => {
      this.snackBar.open(this.setPermissionMessage, 'Dismiss', {
        duration: this.durationInSeconds * 1000,
      });
    }, err => {
      this.permissionError = [];
      err.forEach(prop => {
        this.permissionSetError.push(prop);
        this.timeOutFunction();
      });
    }));
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPointList(param);
    this.table.renderRows();
  }

  FilterDataPoint(event) {
    let param;
    if (event.key === "Enter" || event.type === "click") {
      if (this.searchDataPoint) {
        param = 'like(name,%2A' + this.searchDataPoint + '%2A)';
        this.subs.add(this._dataPoint.get(param).subscribe(data => {
          this.dataPoints = data;
        }, err => this.errorMsg = err));
      } else {
        const param = 'limit(' + this.limit + ',' + this.offset + ')';
        this.getDataPointList(param);
      }
    }
  }

  /**
   * Get Datasource list as per limit and offSet value for pagination using RQL
   */
  getDataPointList(event) {
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.subs.add(this._dataPoint.get(param).subscribe(data => {
      this.dataPointTotalPages = this._dataPoint.total;
      this.dataPoints = data;
      this.dataSource = new MatTableDataSource<DataPoint>(this.dataPoints);
    }, err => this.errorMsg = err));

  }

  readPermission() {
    this.selectedDataPoints();
    const readPermissionBody = {
      'xids': this.selectedDataPointsXid,
      'groups': this.readSelectedPermissions.toString()
    };
    this.subs.add(this._dataPoint.bulkReadPermissionUpdate(readPermissionBody).subscribe(data => {
      this.snackBar.open(this.readPermissionMessage, 'Dismiss', {
        duration: this.durationInSeconds * 1000,
      });
      this.getDataPointList(data);
    }, err => {
      this.permissionError = [];
      err.forEach(prop => {
        this.permissionReadError.push(prop);
        this.timeOutFunction();
      });
    }));
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPointList(param);
    this.table.renderRows();
  }

  selectedDataPoints() {
    this.checkedDataPoints.forEach(dp => {
      this.selectedDataPointsXid.push(dp.xid);
    });
  }

  masterToggle(Event) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.selectAllDataPoints(Event);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectAllDataPoints(Event) {
    if (Event.checked) {
      this.enableGroupPermission = true;
      this.dataPoints.forEach(data => {
        this.checkedDataPoints.push(data);
      });
    } else {
      this.enableGroupPermission = false;
      this.dataPoints.forEach(data => {
        this.checkedDataPoints = this.checkedDataPoints.filter(h => h !== data);
      });
    }

  }

  addDataPointXid(event, dataPoint) {
    if (event.checked) {
      this.enableGroupPermission = true;
      this.checkedDataPoints.push(dataPoint);
    } else {
      this.enableGroupPermission = false;
      this.checkedDataPoints = this.checkedDataPoints.filter(h => h !== dataPoint);
    }
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
