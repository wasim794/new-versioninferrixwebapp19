import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpSenderPointModel, HttpSenderPointService, HttpSenderService} from '../components/http';
import {DataPointDailogComponent} from './dialog/data-point-dailog/data-point-dailog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {CommonService} from '../../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../../common';
import {Router} from '@angular/router';
import {DictionaryService} from "../../core/services";
import { MatPaginator } from '@angular/material/paginator';
import {Observable} from "rxjs";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../common/mat-module';


@Component({
    standalone: true,
    imports:[CommonModule, MatModuleModule],
    providers: [HttpSenderPointService, HttpSenderService, CommonService ],
  selector: 'app-datapoints-list',
  templateUrl: './datapoints-list.component.html',
  styleUrls: []
})
export class DatapointsListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public points = false;
  @Input() dataXID:any;
  search = ['DataPoint'];
  selectedDataPointsColumns: string[] = ['Name', 'Status', 'Include Timestamp', 'Action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<HttpSenderPointModel[]>([]);
  public httpSenderPointModel:any = new HttpSenderPointModel();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs:any= new Observable;
  setPublisher:any;
  limit = 8;
  offset = 0;
  pageSizeOptions: number[] = [8, 12, 16, 20];
  searchDatapoint: any;
  enableMessage = 'Enable Successfully';
  disableMessage= 'Disable Successfully';
  UIDICTIONARY : any;

  constructor(
    public _service: HttpSenderService,
    public dialog: MatDialog,
    public dictionaryService: DictionaryService,
    private _commonService: CommonService,
    public httpSenderPointService:HttpSenderPointService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
  this.dictionaryService.getUIDictionary('publisher').subscribe(data=>{
  this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getDataPoints(param);
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();
  }

  getDataPoints(param: any) {
    this.httpSenderPointService.httpSenderPointModel.forEach(items=>{
      this.setPublisher = items.publisherXid;
    });
    let params = param+'&like(publisherXid,%2A' + this.setPublisher + '%2A)';
    this.httpSenderPointService.get(params).subscribe((data: any)=>{
      this.dataSource.data = data;
    });
  }


  selectDataPoint(event: any, value: any) {
    if (event.source.selected) {
      const dialogRef = this.dialog.open(DataPointDailogComponent, {
        width: '700px',
        height:'470px',
        data:{XID:this.dataXID, dataPointAll:this.httpSenderPointModel},
        disableClose: true

      }).afterClosed()
        .subscribe((response) => {
        });
    }
  }


  getPublisherNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getDataPoints(param);
  }

  filterPublisher(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      if (this.searchDatapoint) {
        const param =
          "like(name,%2A" +
          this.searchDatapoint +
          "%2A)";
        this.getDataPoints(param);
      } else {
        const param = 'limit(' + this.limit + ',' + this.offset + ')';
        this.getDataPoints(param);
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  dataPointDetails(xid: any) {
    localStorage.setItem('dpXid', xid.dataPointXid);
    this.router.navigate(['/datapoint/detail']);
  }

  remove(datapoint: any) {
    this._commonService.openConfirmDialog('Are you want to delete ', datapoint.parameterName).afterClosed().subscribe(response => {
      if (response) {
        const index = this.httpSenderPointService.httpSenderPointModel.indexOf(datapoint);
        this.httpSenderPointService.httpSenderPointModel.splice(index, 1);
        this.dataSource.data = this.httpSenderPointService.httpSenderPointModel;
      }
    });
  }

  changePublisherStatus(element: any, event: any) {
    const param = 'enabled=' + element.enabled + '&restart=' + element.enabled;
    this.subs.add(this.httpSenderPointService.enableDisable(element.xid, param).subscribe((data: any)=>{
    }));
    element.enabled===true?this._commonService.notification(this.enableMessage)
      :this._commonService.notification(this.disableMessage)
  }


}
