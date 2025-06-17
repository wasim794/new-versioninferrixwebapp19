import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WatchList, WatchListPointModel } from '../../watchlist';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { WatchlistService } from '../service';
import { DataSourceService, PointValueService } from '../../core/services';
import { Router } from '@angular/router';
import { WatchlistDatapointDialogComponent } from '../../watchlist';
import { ConfigurationService } from '../../services/configuration.service';
import { WebsocketService } from '../../core/services';
import { UnsubscribeOnDestroyAdapter } from '../../common';
import { SetvalueComponent } from '../common';
import { DictionaryService } from "../../core/services/dictionary.service";
import { DatePipe } from '@angular/common';
import {MatModuleModule} from '../../common/mat-module';
  

interface PushDataPoint {
  xid: string;
  deviceName: string;
  name: string;
}
 
@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers : [DataSourceService, PointValueService, DatePipe],
  selector: 'app-watchlist-data-point-list',
  templateUrl: './watchlist-data-point-list.component.html',
  styleUrls: []
})
export class WatchlistDataPointListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Input() watchlist                           = new WatchList();
  @Output() updatedWatchlist                   = new EventEmitter<any>();
  search                                       = ['DataPoint'];
  displayedColumns                             : string[] = ['name', 'time', 'status', 'action'];
  selectedItems                                : WatchListPointModel[] = [];
  @Input()
  watchListXid!: string;
  dataPoints                                   : WatchListPointModel[] = [];
  private errorMsg                             : any;
  private pointList                            = [];
  private watchListDataPoint                   : any[] | undefined;
  private dataSource!: any[];
  private dataSourceDataPoint                  : any[] | undefined;
  websocket_URL                                = '/point-value?token=';
  websocket                                    : any;
  token!: string;
  socketDataPoint                              : any;
  dataPointData                                : any;
  setViewIcons                                 : boolean = false;
  status                                       : any;
  nodata                                       : any;
  UIDICTIONARY                                 : any;

  @Output() saveModel = new EventEmitter<any>();
  constructor(public dialog: MatDialog, public dictionaryService: DictionaryService, private _commonService: CommonService,
    private router: Router, private watchlistService: WatchlistService,
     private _configurationService: ConfigurationService,
    private _WebSocketService: WebsocketService, public datepipe: DatePipe) {
    super();
    this.token = JSON.parse(localStorage.getItem('access_token')!);
  }

  ngOnInit() {
    // console.log(localStorage.getItem('access_token'));
    this.dictionaryService.getUIDictionary('watchlist').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.getWatchListByXid(this.watchListXid);
    this._WebSocketService.createWebSocket(this.websocket_URL + this.token);
  }

  // getWatchListByXid(xid: string) {
  //   this.subs.add(this.watchlistService.getWatchListData(xid).subscribe(data => {
  //     this.watchlist = data;
  //     this.selectedItems = data['pointModels'];
  //     if (this.selectedItems.length === 0) {
  //       this.nodata = 'No data found';
  //     }
  //     this.selectedItems.forEach(value => {
  //       this.updatedData(value.xid);
  //       this.subscription = this.watchlistService.getAllDatasPoints(value.xid).subscribe(data => {
  //         this.socketDataPoint = data;
  //       });
  //     });
  //   }, err => this.errorMsg = err));
  // }
  //
  // getWebSocket(xid) {
  //   const message = { 'dataPointXid': xid, 'eventTypes': ['CHANGE', 'UPDATE'] };
  //   this._configurationService.connect(message);
  //   this._WebSocketService.subscribeWebsocket().subscribe(data => {
  //     this.dataPointData = JSON.parse(data);
  //     if (data) {
  //       this._commonService.animationHide();
  //     }
  //     let color = null;
  //     if (this.dataPointData.payload.value != null) {
  //       this.endDate = this.dataPointData.payload.renderedValue.timestamp;
  //       this.status = this.dataPointData.payload.renderedValue.pointValue.value;
  //       color = this.dataPointData.payload.renderedValue.pointValue.color;
  //       this.setViewIcons = true;
  //     } else {
  //       this.endDate = 'No Record';
  //       this.status = 'No Record';
  //     }
  //     const dp_xid = this.dataPointData.payload.xid;
  //     this.updateTable(dp_xid, this.status, this.endDate, color);
  //   });
  // }
  //
  //
  // updatedData(xid) {
  //   this.getWebSocket(xid);
  // }
  //
  // updateTable(xid, status, time, color) {
  //   setTimeout(function () {
  //     (<any>$('.text-shadow')).removeClass('text-shadow');
  //   }, 5000);
  //
  //   /*TODO need to update status */
  //
  //   for (let i = 0; i < this.selectedItems.length; i++) {
  //     if (this.selectedItems[i].xid === xid) {
  //       if (color !== null) {
  //         (document.getElementById(xid + '_status')).style.color = color;
  //       } else {
  //         (<any>$('#' + xid + '_time')).addClass('text-shadow');
  //         (<any>$('#' + xid + '_status')).addClass('text-shadow');
  //       }
  //       this.selectedItems[i].status = status;
  //       this.selectedItems[i].time = time;
  //     }
  //   }
  // }


  getWatchListByXid(xid: string) {
    this.subs.add(
      this.watchlistService.getWatchListData(xid).subscribe(
        (data) => {
          this.watchlist = data;
          this.selectedItems = data['pointModels'] || [];
          this.nodata = this.selectedItems.length === 0 ? 'No data found' : null;

          this.selectedItems.forEach((item) => {
            this.fetchDataAndSubscribe(item.xid);
          });
        },
        (err) => {
          this.errorMsg = err;
          console.error('Error fetching watchlist data:', err);
        }
      )
    );
  }

  fetchDataAndSubscribe(xid: string) {
    this.watchlistService.getAllDatasPoints(xid).subscribe(
      (dataPoints) => {
        this.socketDataPoint = dataPoints;
        this.getWebSocket(xid);
      },
      (err) => {
        console.error('Error fetching data points:', err);
      }
    );
  }

  getWebSocket(xid: string) {
    const message = { dataPointXid: xid, eventTypes: ['CHANGE', 'UPDATE'] };

    // Establish WebSocket connection with retries
    this.connectWebSocketWithRetry(message, xid);

    this._WebSocketService.subscribeWebsocket().subscribe(
      (data) => {
        if (!data) return;

        this.dataPointData = JSON.parse(data);
        this._commonService.animationHide();

        const payload = this.dataPointData.payload || {};
        const renderedValue = payload.renderedValue || {};

        const dp_xid = payload.xid;
        const status = renderedValue.pointValue?.value ?? 'No Record';
        const time = renderedValue.timestamp ?? 'No Record';
        const color = renderedValue.pointValue?.color ?? null;

        this.updateTable(dp_xid, status, time, color);
      },
      (err) => {
        console.error('WebSocket subscription error:', err);
        this.handleWebSocketError(xid);
      }
    );
  }

  connectWebSocketWithRetry(message: any, xid: string, retries = 3, delayMs = 3000) {
    let attempt = 0;

    const connect = () => {
      try {
        this._configurationService.connect(message);
      } catch (err) {
        if (attempt < retries) {
          attempt++;
          setTimeout(connect, delayMs);
        } else {
          console.error(`Max WebSocket connection attempts reached for xid: ${xid}. Please check the server.`);
        }
      }
    };

    connect();
  }

  handleWebSocketError(xid: string) {

  }

  updateTable(xid: string, status: string, time: string, color: string | null) {
    const statusElement = document.getElementById(`${xid}_status`);
    const timeElement = document.getElementById(`${xid}_time`);

    if (statusElement && timeElement) {
      if (color) {
        statusElement.style.color = color;
      } else {
        timeElement.classList.add('text-shadow');
        statusElement.classList.add('text-shadow');
      }
    }

    const itemIndex = this.selectedItems.findIndex((item) => item.xid === xid);
    if (itemIndex !== -1) {
      this.selectedItems[itemIndex].status = status;
      this.selectedItems[itemIndex].time = time;
    }
  }


  selectDataPoint(event: { source: { selected: any; }; }, value: string) {
    if (event.source.selected) {
      if (value === 'DataPoint') {
        const dialogRef = this.dialog.open(WatchlistDatapointDialogComponent, {
          data: { watchListXid: this.watchListXid },
          width: '700px',
          height: '530px',
          disableClose: true,
          panelClass:['dataPointAllWatclist']
        });
        dialogRef.afterClosed().subscribe(result => {
          this.saveWatchListPoints(this.watchListXid, result);
          this.saveModel.emit(result);
        });
      }
    }
  }

  deleteDataPoint(dataPoint: WatchListPointModel): void {
    this.dataPoints.push(dataPoint);
    const dp = [dataPoint];
    this._commonService['openConfirmDialog']('Are you want to delete ', dataPoint.name).afterClosed().subscribe((response: any) => {
      if (response) {
        this.subs.add(this.watchlistService.deleteDataPoint(dp, this.watchListXid).subscribe(data => {
          if (data) {
            this.selectedItems = this.selectedItems.filter(h => h !== dataPoint);
          }
        }));
      }
    });
  }

  private addDatapoints(watchListXid: any, pointList: any[]) {
    this.subs.add(this.watchlistService.addDatapoints(watchListXid, pointList).subscribe(value => {
      this.watchlist = value;
      this.selectedItems = value['pointModels'];

    }));
  }

  setVal(dpXid: any, e: any, settable: any, setvalue: string, dataType: any, zeroLabel: any, oneLabel: any) {
    if (setvalue === 'No Record') {
      alert('Set value no record found');
    } else {
      this.dialog.open(SetvalueComponent, {
        data: { dpXid: dpXid, value: setvalue, datatype: dataType, zeroLabel: zeroLabel, oneLabel: oneLabel },
        disableClose: true
      });
    }
  }

  dataPointDetails(xid: any) {
    localStorage.setItem('dpXid', xid);
    this.router.navigate(['/datapoint/detail']);
  }


  
saveWatchListPoints(XID: any, DataPoints: any[]) {
  if (Array.isArray(DataPoints) && DataPoints.length > 0) {
    const pointList: any[] = DataPoints.map((dataPoint) => ({
      xid: dataPoint.xid,
      name: `${dataPoint.deviceName}-${dataPoint.name}`,
      // Add other required fields here if needed:
      // color: dataPoint.color,
      // type: dataPoint.type
    }));

    this.addDatapoints(XID, pointList);
  } else {
    this._commonService.notification('No data selected');
  }
}
}
