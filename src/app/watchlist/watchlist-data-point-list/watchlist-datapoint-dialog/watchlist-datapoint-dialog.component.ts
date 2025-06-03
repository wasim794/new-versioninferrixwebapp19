import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { WatchList } from '../../../watchlist';
// import { DataPointModel } from '../../../datasource/model';
import { CommonService } from '../../../services/common.service';
import { DataPointService, DictionaryService } from '../../../core/services';
import { WatchlistService } from '../../service/';
import { UnsubscribeOnDestroyAdapter } from '../../../common';
import {MatModuleModule} from '../../../common/mat-module';

export interface DialogData {
  watchListXid: string;
}


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [WatchlistService, DictionaryService, DataPointService],
  selector: 'app-watchlist-datapoint-dialog',
  templateUrl: './watchlist-datapoint-dialog.component.html',
  styleUrls: []
})
export class WatchlistDatapointDialogComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  dataPointsTableColumns: string[] = ['select', 'Name'];
  // dataSource:any= new MatTableDataSource<DataPointModel>();
  pointModelType = 'HTTP_SENDER.POINT';
  // selection = new SelectionModel<DataPointModel>(true, []);
  // showDataPoints: DataPointModel[] = [];
  // public dataPoints:any= new DataPointModel();
  private selectedDataPoints = [];
  totalDataPoints: number | undefined;
  // private selectAllDataPointsId: boolean;
  searchDataPoint: string | undefined;
  private errorMsg: any;
  private dataPointXidArray = [];
  private watchList: WatchList | undefined;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  dataPointSize: number | undefined;
  UIDICTIONARY : any;

  constructor(
    public dialogRef: MatDialogRef<WatchlistDatapointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _commonService: CommonService,
    private watchlistService: WatchlistService,
    private _dataPointService: DataPointService,
    public dictionaryService: DictionaryService) {
    super();
  }

  ngOnInit() {
      this.dictionaryService.getUIDictionary('watchlist').subscribe((data: any)=>{
       this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.getDataPointsFromWatchList(this.limit, this.offset);
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPoints(param);
  }
  getNext(event: { pageSize: number; pageIndex: number; }) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getDataPoints(param);
  }

  getDataPointsFromWatchList(limit: number, offset: number) {
    // this.subs.add(this.watchlistService.getWatchListData(this.data.watchListXid).subscribe(data => {
    //   this.watchList = data;
    //   const param = 'like(name,%2A' + this.limit + '%2A)|like(deviceName,%2A' + this.offset + '%2A)';
    //   this.subs.add(this._dataPointService.getDataPointFromRQL(this.limit, this.offset).subscribe((dataPoint: { [x: string]: number; }) => {
    //     this.dataPoints = dataPoint['items'];
    //     this.selectAllDataPointsId = false;
    //     this.showDataPoints = this.dataPoints;
    //     this.dataPointSize = dataPoint['total'];
    //     if (this.watchList.pointModels.length > 0) {
    //       this.watchList.pointModels.forEach(value => {
    //         // @ts-ignore
    //         this.dataPointXidArray.push(value.xid);
    //       }
    //       );
    //       this.dataPointXidArray.forEach(xid => {
    //         const dataPointData = this._commonService.getSelectedDataPoint(xid, this.dataPoints);
    //         this.showDataPoints = this.showDataPoints.filter(h => h.xid !== dataPointData.xid);
    //       });
    //       this.dataSource = new MatTableDataSource<DataPointModel>(this.showDataPoints);
    //       this.dataPointXidArray = [];
    //     }
    //   }));
    // }, err => this.errorMsg = err));
  }

  addDataPointXid(event: { checked: any; }, dataPoint: any) {
    // if (event.checked) {
    //   this.selectedDataPoints.push(dataPoint);
    // } else {
    //   this.selectedDataPoints = this.selectedDataPoints.filter(h => h !== dataPoint);
    // }
  }

  selectAllDataPoints(Event: { checked: any; }) {
    // if (Event.checked) {
    //   this.showDataPoints.forEach(data => {
    //     this.selectedDataPoints.push(data);
    //   });
    // } else {
    //   this.showDataPoints.forEach(data => {
    //     this.selectedDataPoints = this.selectedDataPoints.filter(h => h !== data);
    //   });
    // }
  }
  FilterDataPoint() {
    // const param = 'like(deviceName,%2A' + this.searchDataPoint + '%2A)'.trim().toLowerCase();
    // this.subs.add(this._dataPointService.get(param).subscribe((data: any) => {
    //   this.dataSource.data = data;
    // }));
  }

  addPointToHttpModule() {
    // if (this.selectedDataPoints && this.selectedDataPoints.length > 0) {
    //   const selectedXids = new Set(this.selectedDataPoints.map(data => data.xid));
    //   this.showDataPoints = this.showDataPoints.filter(item => !selectedXids.has(item.xid));
    //   this.selectAllDataPointsId = false;
    //   this._commonService.notification('Your selected data has been added successfully');
    //   this.dialogRef.close(this.selectedDataPoints);
    // } else {
    //   this._commonService.notification('Please select at least one');
    // }

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.data.length;
    // return numSelected === numRows;
  }

  isChecked() {
    // return this.selection.isSelected(node.xid);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // if (this.isAllSelected()) {
    //   // Deselect all rows
    //   this.selection.clear();
    //   this.selectedDataPoints = [];
    // } else {
    //   this.dataSource.data.forEach((row: any) => {
    //     this.selection.select(row.xid);
    //     this.selectedDataPoints.push(row as never);
    //   });
    // }
  }

  getDataPoints(param: string): void {
    this.subs.add(this._dataPointService.get(param).subscribe((data: any) => {
      // this.dataPoints = data;
      this.totalDataPoints = this._dataPointService.total;
      // this.dataSource = new MatTableDataSource<DataPointModel>(this.dataPoints);
    }));
  }
}
