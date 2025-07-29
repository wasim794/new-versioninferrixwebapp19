import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DatasourceService} from '../datasource/service/datasource.service';
import {DataSourceService, DataPointService} from "../core/services";
import {DatasourceModel} from '../datasource/model/datasourceModel';
import {DataPoint} from './model/dataPoint';
import {CommonService} from '../services/common.service';
import {commonHelp} from '../help/commonHelp';
import {HelpModalComponent} from '../help/help-modal/help-modal.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SelectionModel} from '@angular/cdk/collections';
import {PermissionDatapointDailogComponent} from './permission-datapoint-dailog/permission-datapoint-dailog.component';
import {UnsubscribeOnDestroyAdapter} from '../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DictionaryService} from "../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers:[ DataPointService, DataSourceService, DatasourceService, DictionaryService, CommonService],
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: []
})
export class PermissionComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('layoutSideBar_tag') layoutSideBarRef!: ElementRef;
  dataSources: any;
  private errorMsg: any;
  private dataPoints:any = new DataPoint();
  permissions!: string;
  private dataPointsArray: any[] = [];
  private selectedDataPointsXid: any[] = [];
  private DatasourceSelectedRow: any;
  searchDatasource!: string;
  enableDataSourcePermission!: boolean;
  limit = 10;
  private offset = 0;
  totalPages!: number;
  private pageNumber: any;
  private sortingOrder = 'ascending';
  private dataPointPageNumber: any;
  private dataPointLimit = 6;
  private dataPointTotalPages!: any;
  private selectedDatasourceId!: number;
  private isSaveReadPermission!: boolean;
  private isSaveSetPermission!: boolean;
  permissionError: any = [];
  private permissionReadError: any = [];
  private permissionSetError: any = [];
  info = new commonHelp();
  selectedPermissions!: any[];
  private selectedDataSources: any[] = [];
  dataSource: any;
  tableColumns = ['Select', 'DatasourceName', 'EditPermission', 'DataPoints'];
  selection = new SelectionModel<DatasourceModel>(true, []);
  private setEditPermissionBody!: { xids: any[]; groups: string };
  private applyPermissionMessage = ' Permission Applied successfully';
  pageSizeOptions: number[] = [8, 12, 16, 20];
  @Output() systemsettingsidebar = new EventEmitter<any>();
  public messageError!: boolean;
  UIDICTIONARY : any;

  constructor(
    private datasourceService: DatasourceService,
    private _dataSource : DataSourceService,
    private dialog: MatDialog,
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private dataPointService : DataPointService,
    public snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('systemSettings').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataSourceList(param);
    this.getPermission();


  }

  /**
   * Get Datasource list as per limit and offSet value for pagination using RQL
   */
  getDataSourceList(param: string) {
    this.subs.add(this._dataSource.get(param).subscribe(data => {
      this.totalPages = this._dataSource.total;
      this.dataSources = data;
      this.dataSource = new MatTableDataSource<DatasourceModel>(this.dataSources);

    }, err => this.errorMsg = err));
  }

  getPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  /**
   * Get Datasource list as per limit and offSet value for pagination using RQL
   */
  getDataPointList(params: string) {
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.subs.add(this.dataPointService.get(param).subscribe(data => {
      this.dataPointTotalPages = data;
      this.dataPoints = data;
    }, err => this.errorMsg = err));
  }

  showSidebarSetDataPointsPermission(datasource: any) {
    this.dialog.open(PermissionDatapointDailogComponent, {
      data: {datasource: datasource},
      width: '790px',
      panelClass: ['permission-overflow'],
      disableClose: true,
    });
  }

  readPermission() {
    let readPermissions = (<any>$('#readPermission')).dropdown('get value');
    if (readPermissions != null) {
      readPermissions = readPermissions.toString();
    }
    this.selectedDataPoints();
    const readPermissionBody = {
      'xids': this.selectedDataPointsXid,
      'groups': readPermissions
    };
    this.subs.add(this.dataPointService.bulkReadPermissionUpdate(readPermissionBody).subscribe(data => {
      this.isSaveReadPermission = true;
      this.timeOutFunction();
    }, err => {
      this.permissionError = [];
      err.forEach((prop: any) => {
        this.permissionReadError.push(prop);
        this.timeOutFunction();
      });
    }));
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPointList(param);
  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }


  setPermission() {
    // let setPermissions = (<any>$('#setPermission')).dropdown('get value');
    // if (setPermissions != null) {
    //   setPermissions = setPermissions.toString();
    // }
    // this.selectedDataPoints();
    // const setPermissionBody = {
    //   'xids': this.selectedDataPointsXid,
    //   'groups': setPermissions
    // };
    // this.subs.add(this.dataPointService.bulkSetPermissionUpdate(setPermissionBody).subscribe(data => {
    //   this.isSaveSetPermission = true;
    //   this.timeOutFunction();
    // }, err => {
    //   this.permissionError = [];
    //   err.forEach((prop: any) => {
    //     this.permissionSetError.push(prop);
    //     this.timeOutFunction();
    //   });
    // }));
    // const param = 'limit(' + this.limit + ',' + this.offset + ')';
    // this.getDataPointList(param);
  }


  selectedDataPoints() {
    // this.dataPointsArray = [];
    // const dataPoints = (<any>$('#dataPoint')).dropdown('get value').toString();
    // const dataPoint = dataPoints.split(',');
    // for (let i = 0; i < dataPoint.length; i++) {
    //   dataPoint[i] = dataPoint[i].replace(/^\s*/, '').replace(/\s*$/, '');
    //   this.dataPointsArray.push(dataPoint[i]);
    // }
  }

  saveEditPermission() {
    if (this.selectedDataSources.length > 0) {
      this.setEditPermissionBody = {
        'xids': this.selectedDataSources,
        'groups': this.selectedPermissions.toString()
      };
    }
    this.subs.add(this.dataPointService.bulkSetEditPermissionDataPoints(this.setEditPermissionBody).subscribe(data => {
      this.selectedDataSources = [];
      this.commonService.notification(this.applyPermissionMessage);
      const param = 'limit(' + this.limit + ',' + this.offset + ')';
      this.getDataSourceList(param);
      this.systemsettingsidebar.emit(data);
    }, err => {
      this.permissionError = [];
      err.forEach((prop: any) => {
        this.permissionError.push(prop);
        this.timeOutFunction();
      });
    }));

  }


  FilterDatasource(event: { key: string; type: string; }) {
    let param;
    if (event.key === "Enter" || event.type === "click") {
      if (this.searchDatasource !== '') {
        param = 'like(name,%2A' + this.searchDatasource + '%2A)';
        this.subs.add(this._dataSource.get(param).subscribe(data => {
          this.dataPointTotalPages = this._dataSource.total;
          this.dataSources = data;
          this.dataSource = new MatTableDataSource<DatasourceModel>(this.dataSources);
        }, err => this.errorMsg = err));
      } else {
        const param = 'limit(' + this.limit + ',' + this.offset + ')';
        this.getDataSourceList(param);
      }
    }
  }

  permissionHelpModel() {
    this.dialog.open(HelpModalComponent, {
      panelClass: ['permission-overflow'],
      data: {title: 'Permission Help', content: this.info.htmlPermissionHelp},
      disableClose: true
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(Event: { checked: any; }) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: DatasourceModel) => this.selection.select(row));
    this.selectAllDataSource(Event);
    if (!Event.checked) {
      this.enableDataSourcePermission = false;
      this.selectedDataSources = [];
      this.selection.clear();
    }
  }

  selectAllDataSource(Event: { checked: any; }) {
    if (Event.checked) {
      this.dataSources.forEach((data: { xid: any; }) => {
        this.selectedDataSources.push(data.xid);
      });
    } else {
      this.dataSources.forEach((data: any) => {
        this.selectedDataSources = this.selectedDataSources.filter(h => h !== data);
      });
      this.selection.clear();
    }
    if (this.selectedDataSources.length >= 1) {
      this.enableDataSourcePermission = true;
    } else {
      this.enableDataSourcePermission = false;
    }
  }

  addDataSourceXid(xid: any, event: { checked: any; }) {
    this.DatasourceSelectedRow = xid;
    if (event.checked) {
      this.selectedDataSources.push(xid);
      if (this.selectedDataSources.length >= 1) {
        this.enableDataSourcePermission = true;
      }
    } else {
      this.selectedDataSources = this.selectedDataSources.filter(item => item !== xid);
      if (this.selectedDataSources.length >= 1) {
        this.enableDataSourcePermission = true;
      }

    }
  }

  getNextDataSources(event: { pageSize: number; pageIndex: number; }) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getDataSourceList(param);
  }
}
