import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  HttpSenderModel,
  HttpSenderPointModel, 
} from '../../../components/http';
import {HttpSenderService} from '../../../components/http/service/http-sender.service';
import {HttpSenderPointService} from '../../../components/http/service/http-sender-point.service';

import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {CommonService} from '../../../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {DataPointService} from '../../../../core/services';
import {DataPointModel} from '../../../../core/models/dataPoint';
import {DictionaryService} from "../../../../core/services/dictionary.service";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
import { AnyCnameRecord } from 'dns';

export interface DialogData {
  httpSender: HttpSenderModel;
}

@Component({
  standalone: true,
  imports:[CommonModule, MatModuleModule],
  providers:[HttpSenderService, DictionaryService, CommonService],
  selector: 'app-data-point-dailog',
  templateUrl: './data-point-dailog.component.html',
  styleUrls: []
})
export class DataPointDailogComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  dataPointsTableColumns: string[] = ['select', 'Name'];
  dataSource!: MatTableDataSource<DataPointModel>;
  limit = 12;
  offset = 0;
  totalDataPoints!: number;
  pageSizeOptions: number[] = [12, 16, 20];
  selection: any = new SelectionModel<string>(true, []);
  private dataPoints!: DataPointModel[];
  searchDataPoint!: string;
  UIDICTIONARY : any;

  constructor(
    public dialogRef: MatDialogRef<DataPointDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _publisherService: HttpSenderService,
    private _commonService: CommonService,
    public httpSenderPointService:HttpSenderPointService,
    public dictionaryService: DictionaryService,
    private _dataPointService: DataPointService) {
    super();
  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('publisher').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
        });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPoints(param);
    if (this.httpSenderPointService.httpSenderPointModel.length > 0) {
      this.httpSenderPointService.httpSenderPointModel.forEach((point) => {
        this.selection.select(point.dataPointXid);
      });
    }
  }

  // pagination
  getNext(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getDataPoints(param);
  }

  getDataPoints(param: string): void {
    this.subs.add(this._dataPointService.get(param).subscribe(data => {
      this.dataPoints = data;
      this.totalDataPoints = this._dataPointService.total;
      this.dataSource = new MatTableDataSource<DataPointModel>(this.dataPoints);
    }));
  }

  getSelectedDataPoints(): string {
    let param = 'in(xid,(';
    this.selection.selected.forEach((xid: any) => {
      param = param + xid + ',';
    });
    param = param + '))';
    return param;
  }

  addDataPointXid(event: any, dataPoint: any) {
    if (event.checked) {
      this.selection.select(dataPoint.xid);
    } else {
      this.selection.deselect(dataPoint.xid);
    }
  }

  filterDataPoints() {
    const param = 'like(deviceName,%2A' + this.searchDataPoint + '%2A)';
    this.subs.add(this._dataPointService.get(param).subscribe(data => {
      this.dataSource.data = data;
    }));
  }

  addPointToHttpModule() {
    if (this.selection.selected.length > 0) {
      const param = this.getSelectedDataPoints();
      this._dataPointService.get(param).subscribe(data => {
        this.httpSenderPointService.httpSenderPointModel = data.map((model) => this.convertToHttpSenderPointModel(model));
      this.dialogRef.close(param);
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isChecked(node: any): boolean {
    return this.selection.isSelected(node.xid);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.dataSource.data.forEach(value =>
      this.selection.select(value.xid));

  }

  private convertToHttpSenderPointModel(model: DataPointModel): HttpSenderPointModel {
    const pointModel: any = new HttpSenderPointModel();
    pointModel.dataPointXid = model.xid;
    pointModel.parameterName = model.deviceName + '-' + model.name;
    pointModel.name =  model.name;
    pointModel.status = model.enabled;
    pointModel.includeTimestamp = true;
    pointModel.publisherXid = this.data.XID;
    this.httpSenderPointService.create(pointModel).subscribe((data:any)=>{
      this._commonService.notification(data.name+' '+'is added Successfully');
    });
    return pointModel;
  }
}
