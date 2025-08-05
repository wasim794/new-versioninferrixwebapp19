import {
  Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output} from '@angular/core';
import { DataPointModel } from '../../../model';
import { DatasourceService } from '../../../service/datasource.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfigurationService } from '../../../../services/configuration.service';
import { PointValueService, WebsocketService, DictionaryService } from '../../../../core/services';
import { UnsubscribeOnDestroyAdapter } from '../../../../common';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatModuleModule } from '../../../../common/mat-module';
// import { SetvalueComponent } from '../../../../watchlist';
import {EventDetectorsComponent, DatapointPropertiesComponent, SetvalueComponent} from '../../common';


@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [ConfigurationService,PointValueService, WebsocketService, DictionaryService, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-datapoint-table',
  templateUrl: './datapoint-table.component.html',
  styleUrls: []
})
export class DatapointTableComponent extends UnsubscribeOnDestroyAdapter {
  @Input()
  dataPoints: any = new MatTableDataSource<any>([]);
  @Output() editPoint = new EventEmitter<any>();
  @Output() addPoint = new EventEmitter<any>();
  displayedColumns: string[] = ['dataType', 'name', 'time', 'value', 'status', 'action'];
  dataPoint: DataPointModel = new DataPointModel();
  subscription: Subscription;
  currentDatapointIndex: any;
  websocket_URL = '/point-value?token=';
  websocket: any;
  token: string;
  dataPointData: any;
  nodata: any;
  private endDate: any;
  status: any;
  name!: string;
  enabled!: boolean;
  color!: string;
  totoalDatapoints!: any;
  limit = 10;
  offset = 0;
  pageSizeOptions: number[] = [10, 15, 20];
  datasourceId!: number;
  datasourceXid: any;
  searchDatapoint!: string;
  setvalue!: string;
  hideAdd!: boolean;
  setViewIcons: boolean = false;
  UIDICTIONARY: any;
  readAndUpdateMsg = "This is read and update only";
  hideSetValue!: boolean;

  constructor(private datasourceService: DatasourceService,
    private dialog: MatDialog,
    private _configurationService: ConfigurationService,
    private commonService: CommonService,
    private _WebSocketService: WebsocketService,
    private router: Router,
    public dictionaryService: DictionaryService,
    private _pointValueService: PointValueService,
    public datepipe: DatePipe) {
    super();
    this.token = JSON.parse(localStorage.getItem('access_token')!);
    this.subscription = this.datasourceService.getReloadedDatapoint().subscribe(data => {
      this.reloadDatapoint(data['data']);
    });
  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('datasource').subscribe(data => {
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
  }

  reloadDatapoint(data: DataPointModel) {
    this.dataPoint = data;
    this.dataPoints.data[this.currentDatapointIndex] = this.dataPoint;
    this.dataPoints.filter = '';
    this.updatedData(this.dataPoint.xid);
  }

  getNext(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getDatapoints(this.limit, this.offset);
  }

  filterDatapoint() {
    if (this.searchDatapoint) {
      this.datasourceService.FilterDataPoint(this.searchDatapoint, this.datasourceId).subscribe(data => {
        this.dataPoints.data = data;
      });
    } else {
      this.getDatapoints(this.limit, this.offset);
    }
  }

  getDatapoints(limit: any, offset: any): void {
    this.datasourceService.getDataSourcePointsbyLimit(this.datasourceId, limit, offset).subscribe(data => {
      this.totoalDatapoints = data;
      if (this.totoalDatapoints === 0) {
        this.nodata = 'No data found';
      }
      this.dataPoints = new MatTableDataSource(data);
      console.log(this.dataPoints.data);
      console.log(this.dataPoints.data['items']);
      this.dataPoints.data.items.forEach((value: any) => {
        this.updatedData(value.xid);
      });
    });
  }

  addDatapointToTable(datapoint: DataPointModel) {
    // console.log(this.dataPoints.data['items']);
    this.dataPoints.data['items'].push(datapoint);
    this.dataPoints.filter = '';
    this.getDatapoints(this.limit, this.offset);
    this.updatedData(datapoint.xid);
  }

  changeStatus(e: any, dpXid: any) {
    const statusValue = e.checked;
    this.datasourceService.setDatapointStatus(dpXid, statusValue).subscribe();
    this.updatedData(dpXid);
  }

  setVal(element: any) {
    if (element.websocketStatus === 'No Record') {
      alert('Set value no record found');
    } else {
      this.dialog.open(SetvalueComponent, {
        data: { dataPoint: element },
        disableClose: true
      });
    }
  }

  setDatapoints(datasource: { xid: any; id: number; }) {
    this.datasourceXid = datasource.xid;
    this.datasourceId = datasource.id;
    this.getDatapoints(this.limit, this.offset);
  }

  addNewDatapoint(datasource: { filteredData: { pointLocator: { modelType: string; }; }[]; }) {
    this.addPoint.emit(this.datasourceXid);
    if (datasource.filteredData[0] === undefined) {
      this.addPoint.emit(this.datasourceXid);
    }

    else if (datasource.filteredData[0].pointLocator.modelType === 'PEOPLE_COUNT_CAMERA.PL' ||
      datasource.filteredData[0].pointLocator.modelType === 'VIRTUAL_SWITCH.PL' ||
      datasource.filteredData[0].pointLocator.modelType === 'DISTANCE_SENSOR.PL') {
      this.commonService.notification(this.readAndUpdateMsg);
      return;
    } else {
      this.addPoint.emit(this.datasourceXid);
    }
    this.addPoint.emit(this.datasourceXid);

  }

  getWebSocket(xid: any) {
    const message = { 'dataPointXid': xid, 'eventTypes': ['INITIALIZE', 'CHANGE', 'UPDATE', 'SET'] };
    // console.log(message);
    this._configurationService.connect(message);
    this._WebSocketService.subscribeWebsocket().subscribe(data => {
      this.dataPointData = JSON.parse(data);
      if (this.dataPointData.payload.value != null) {
        this.hideSetValue = true;
        let color = null;
        this.endDate = this.dataPointData.payload.renderedValue.timestamp;
        this.enabled = this.dataPointData.payload.enabled;
        this.status = this.dataPointData.payload.renderedValue.pointValue.value;
        this.color = this.dataPointData.payload.renderedValue.pointValue.color;
      } else {
        this.endDate = 'No Record';
        this.status = 'No Record';
      }
      const dp_xid = this.dataPointData.payload.xid;
      this.updateTable(dp_xid, this.status, this.endDate, this.color, this.enabled);
      if (this.setViewIcons == false) {

      }
    });
  }


  updatedData(xid: string) {
    this.getWebSocket(xid);
  }

  updateTable(xid: string, status: any, time: any, color: string | null, enabled: boolean) {
    // console.log('updateTable called with xid:', xid, 'status:', status, 'time:', time, 'color:', color, 'enabled:', enabled);
    setTimeout(function () {
      document.querySelectorAll('.text-shadow').forEach(element => {
        element.classList.remove('text-shadow');
      });
    }, 5000);

    /*TODO need to update status */
// console.log('Updating dataPoints for xid:', this.dataPoints.data.items);

    for (let i = 0; i < this.dataPoints.data.items.length; i++) {

      if (this.dataPoints.data.items[i].xid === xid) {
        if (color !== null) {
          const statusElement = document.getElementById(xid + '_status');
          if (statusElement) statusElement.style.color = color;
        } else {
          const timeElement = document.getElementById(xid + '_time');
          const statusElement = document.getElementById(xid + '_status');
          if (timeElement) timeElement.classList.add('text-shadow');
          if (statusElement) statusElement.classList.add('text-shadow');
        }
        this.dataPoints.data.items[i].websocketStatus = status;
        this.dataPoints.data.items[i].webSocketTime = time;
        this.dataPoints.data.items[i].enabled = this.enabled;
        // console.log( 'Updated dataPoints:', this.dataPoints.data[i]);
      }
    }
  }

  edit(dataPointXid: any, index: any) {
    const dpDetail = { dpXid: dataPointXid, index: index };
    this.editPoint.emit(dpDetail);
    console.log( 'Editing datapoint with xid:', dataPointXid, 'at index:', index);
    document.body.classList.remove('sidebarFormBblock');
  }

  addProperties(datapoint: DataPointModel, index: any) {
    this.currentDatapointIndex = index;
    this.dialog.open(DatapointPropertiesComponent, {
      data: {content: datapoint},
         width:'40%',
      disableClose: true
    });

  }

  dataPointDetails(xid: any) {
    localStorage.setItem('dpXid', xid);
   this.router.navigate(['datapoint', 'detail']);
  }

  deleteDatapoint(datapoint: DataPointModel) {
    this.commonService
      .openConfirmDialog('Are you want to delete the datapoint !!! ', datapoint.name).afterClosed().subscribe(response => {
        if (response) {
          this.datasourceService.deleteDatapoint(datapoint.xid).subscribe(data => {
            if (Array.isArray(this.dataPoints.data['items'])) {
              this.dataPoints.data = this.dataPoints.data['items'].filter((h: any) => h.xid !== datapoint.xid);
              this.dataPoints.filter = '';
              console.log('Datapoint deleted successfully. Updated table data:', this.dataPoints.data);
              this.getDatapoints(this.limit, this.offset);
            } else {
              console.error('this.dataPoints.data is not an array, cannot filter.', this.dataPoints.data);
            }
          });
        }
      });
  }

  addEventDetectors(datapoint: DataPointModel, index: any) {
    this.dialog.open(EventDetectorsComponent, {
      data: {content: datapoint},
      width:'80%',
      height:'600px',
      panelClass:['eventModal'],
      disableClose: true
    });
  }


}
