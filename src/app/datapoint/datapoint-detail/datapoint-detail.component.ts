import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {DataPointService, PointValueService, EventsService, UserCommentsService} from '../../core/services';
import {ActivatedRoute} from '@angular/router';
import {EventInstanceModel} from '../../core/models/events';
import {DataPointDetail} from '../../core/models/dataPoint';
import {UserCommentsModel} from '../../core/models/comments';
import {ConfigurationService} from '../../services/configuration.service';
import {DataPointModel} from '../../core/models/dataPoint';
import {FormGroup, FormControl} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import {DictionaryService} from "../../core/services/dictionary.service";
import {UsersService} from '../../users/service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatModuleModule } from '../../common/mat-module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, NgxChartsModule, OwlDateTimeModule, OwlNativeDateTimeModule],
  providers: [CommonService, ConfigurationService, UsersService, DictionaryService],
  selector: 'app-datapoint-detail',
  templateUrl: './datapoint-detail.component.html',
  styleUrls: []
})
export class DatapointDetailComponent implements OnInit {
  dpId!: any;
  dataPoint!: DataPointModel;
  dataPointDetails!: DataPointDetail[];
  eventsLists: any = EventInstanceModel;
  UserComments: any = new UserCommentsModel();
  UserCommentLists!: UserCommentsModel[];
  userDatatable!: boolean;
  chartDataPointDetail: any[] = [];
  pieChartDataPointDetail: any = [];
  JsonData: any[] = [];
  pieJsonData: any[] = [];
  data: any[] = [];
  colorScheme: any = {
    domain: ['#501925', '#ffe29a']
  };
  time = 'Date-Time';
  dataValue = 'Data-Value';
  websocket: any;
  token: any;
  dataPointData: any;
  epochDateFrom: any;
  epochDateTo: any;
  dataPointsList: any[] = [];
  loadDetails!: boolean;
  tabIndex = 0;
  limit = 0;
  displayedColumns: string[] = ['dataType', 'value', 'date', 'time', 'annotation'];
  displayedEventsColumns: string[] = ['id', 'alarmLevel', 'message', 'time', 'acknowledged'];
  displayedUserColumns: string[] = ['S.N', 'Comments', 'DateTime', 'Actions'];
  date = new FormControl(new Date());
  JsonValue: any;
  dateFrom = new Date();
  dateTo = new Date();
  settings = {
    bigBanner: true,
    timePicker: true,
    format: 'dd-mm-yyyy hh:mm a',
    defaultOpen: false,
    closeOnSelect: false
  };
  timePicker = new Date();
  isLatest!: boolean;
  isEdit!: boolean;
  @ViewChild('dynamicLoadComponent', {read: ViewContainerRef}) entry!: ViewContainerRef;
  componentRef: any;
  from!: string;
  selectionData!: boolean;
  searchDatasource!: string;
  userId!: number;
  chartHide!: boolean;
  chartHideTwo!: boolean;
  nameDataSourceName: any;
  private SubmitSuccessfully = "Save successfully";
  private UpdateSuccessfully = "Update successfully";
  private DeleteSuccessfully = "Delete successfully";
  UIDICTIONARY : any;

  constructor(private _datapointService: DataPointService,
              private _pointValueService: PointValueService,
              private _userCommentsService: UserCommentsService,
              public dictionaryService: DictionaryService,
              private route: ActivatedRoute, private usersService: UsersService,
              private eventService: EventsService, private _configurationService: ConfigurationService, private resolver: ComponentFactoryResolver, private commonService: CommonService) {
   this.token = (localStorage.getItem('access_token'));


  }

  ngOnInit() {
    const id = localStorage.getItem('dpXid');
    this.dpId = id;
    this.searchDatasource = this.dpId;
    this.getDetails(this.dpId);
    this.getUserComment();
    this.isLatest = false;
    this.dictionaryService.getUIDictionary('dataPoint').subscribe(data=>{
     this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.getChartAllData();
    this.getUserID(localStorage.getItem('UserName'));

  }

  getDataPoint(param: string) {
    this._datapointService.get(param).subscribe(data => {
      this.dataPointsList = data;
    }, err => console.log(err));
  }

  getUserID(username: any) {
    this.usersService.getUser(username).subscribe(data => {
      this.userId = data.id;
    });
  }

  autoSearch() {
    if (this.searchDatasource === '') {
      this.selectionData = false;
    } else {
      this.selectionData = true;
      const param = 'like(name,%2A' + this.searchDatasource + '%2A)|like(deviceName,%2A' + this.searchDatasource + '%2A)';
      //return false;
      this.getDataPoint(param);
    }
  }

  selectedValue(dataPoint: any) {
    this.selectionData = false;
    this.searchDatasource = dataPoint.dataSourceName;
    this.getDetails(dataPoint.xid);
  }

  getDetails(id: any) {
    this._datapointService.getByXid(id).subscribe(data => {
      this.dataPoint = data;
    this.nameDataSourceName = data.name + ' - ' + data.dataSourceName;
      this.searchDatasource = this.dataPoint.dataSourceName;
      this.loadDetails = true;
    }, err => console.log(err));

    this._pointValueService.getLatestValue(id).subscribe(data => {
      this.dataPointDetails = data;
    }, err => console.log(err));
    const idArray = [id];
    this.eventService.getDataPointEventLevelSummary(idArray).subscribe(data => {
      this.eventsLists = data;
    }, err => console.log(err));
  }

  getHistory(limit: any) {
    this._pointValueService.getLatestValue(this.dpId, limit).subscribe(data => {
      this.dataPointDetails = data;
    }, err => console.log(err));
  }

  getUserComment() {
    this._userCommentsService.get().subscribe(data => {
      this.UserCommentLists = data;
      this.UserCommentLists.length === 0 ? this.userDatatable = false : this.userDatatable = true;
    }, err => console.log(err));
  }

  addComment() {
    this.UserComments.username = localStorage.getItem('UserName');
    this.UserComments.userId = this.userId;
    this.UserComments.referenceId = this.dpId;
    this.UserComments.timestamp = new Date().getTime();
    this.UserComments.commentType = 'POINT';
    this._userCommentsService.save(this.UserComments).subscribe(data => {
      this.commonService.notification(this.SubmitSuccessfully);
      this.getUserComment();
      this.clearComment();
    }, err => console.log(err));
  }

  Edit(allData: any) {
    this._userCommentsService.getByXid(allData.xid).subscribe(data => {
      this.UserComments = data;
      this.isEdit = true;
    }, err => console.log(err));
  }

  updateComment(allData: any) {
    this._userCommentsService.update(this.UserComments.xid, this.UserComments).subscribe(data => {
      this.UserComments = data;
      this.commonService.notification(this.UpdateSuccessfully);
      this.isEdit = false;
      this.getUserComment();
      this.clearComment();
    }, err => console.log(err));
  }

  Delete(allData: any) {
    let text = "are you want.?" + allData.comment;
    if (confirm(text) == true) {
      this._userCommentsService.delete(allData.xid).subscribe(data => {
        this.commonService.notification(this.DeleteSuccessfully);
        this.isEdit = false;
        this.getUserComment();
        this.clearComment();
        return true;
      }, err => console.log(err));
    } else {
      // return false;
    }

  }

  getChartAllData() {
    this.ChartDataLoad();
  }

  ChartDataLoad() {
    this.JsonData = [];
    this._pointValueService.getLatestValue(this.dpId).subscribe(data => {
      this.chartDataPointDetail = data;
      this.convertDateTime();
      if (this.JsonData) {
        this.toPushData();
      }
    }, err => console.log(err));

  }

  convertDateTime() {
    for (let i = 0; i < this.chartDataPointDetail.length; i++) {
      const date = new Date(this.chartDataPointDetail[i].timestamp);
      this.JsonData[i] = {
        'name': +date.getDate() +
          "/" + (date.getMonth() + 1) +
          "/" + date.getFullYear() +
          " " + date.getHours() +
          ":" + date.getMinutes() +
          ":" + date.getSeconds(),
        'value': this.chartDataPointDetail[i].value
      };
    }
  }

  public toPushData() {
    this.data = [];
    for (let i = 0; i < this.JsonData.length; i++) {
      this.data.push(this.JsonData[i]);
    }

  }

  clearComment() {
    this.UserComments.comment = '';
    this.isEdit = false;
  }

  //updated code fine

  selectTab(index: number): void {
    this.tabIndex = index;
  }

  lineChartDateWise() {
    this.epochDateFrom = Date.UTC(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate(), this.commonService.fromTime.getHours(), this.commonService.fromTime.getMinutes(), this.commonService.fromTime.getSeconds(), this.commonService.fromTime.getMilliseconds());
    this.epochDateTo = Date.UTC(this.dateTo.getFullYear(), this.dateTo.getMonth(), this.dateTo.getDate(), this.commonService.toTime.getHours(), this.commonService.toTime.getMinutes(), this.commonService.toTime.getSeconds(), this.commonService.toTime.getMilliseconds());

    this._pointValueService.getBetweenValue(this.dpId, this.epochDateFrom, this.epochDateTo).subscribe(data => {
      this.chartDataPointDetail = data;
      for (let i = 0; i < this.chartDataPointDetail.length; i++) {
        const date = new Date(this.chartDataPointDetail[i].timestamp);
        this.JsonData[i] = {
          'name': +date.getDate() +
            "/" + (date.getMonth() + 1) +
            "/" + date.getFullYear() +
            " " + date.getHours() +
            ":" + date.getMinutes() +
            ":" + date.getSeconds(),
          'value': this.chartDataPointDetail[i].value
        };
      }
      if (this.JsonData) {
        this.toPushData();
        this.chartHide = true;

      }
    }, err => console.log(err));
  }

  pieChartLoad() {
    this._pointValueService.getLatestValue(this.dpId).subscribe(data => {
      this.pieJsonData = [];
      this.pieChartDataPointDetail = data;
      for (let i = 0; i < this.pieChartDataPointDetail.length; i++) {
        const date = new Date(this.pieChartDataPointDetail[i].timestamp);
        const jsonData = {
          'name': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
          'value': this.pieChartDataPointDetail[i].value
        };
        this.pieJsonData.push(jsonData);
      }
    }, err => console.log(err));

  }

  pieChartDateWise() {
    this.epochDateFrom = Date.UTC(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate(), this.commonService.fromTime.getHours(), this.commonService.fromTime.getMinutes(), this.commonService.fromTime.getSeconds(), this.commonService.fromTime.getMilliseconds());
    this.epochDateTo = Date.UTC(this.dateTo.getFullYear(), this.dateTo.getMonth(), this.dateTo.getDate(), this.commonService.toTime.getHours(), this.commonService.toTime.getMinutes(), this.commonService.toTime.getSeconds(), this.commonService.toTime.getMilliseconds());
    this._pointValueService.getBetweenValue(this.dpId, this.epochDateFrom, this.epochDateTo).subscribe(data => {
      this.pieChartDataPointDetail = data;
      this.pieJsonData = [];
      this.pieChartDataPointDetail.forEach((element: any) => {
        const date = new Date(element.timestamp);
        const jsonData = {
          'name': +date.getDate() +
            "/" + (date.getMonth() + 1) +
            "/" + date.getFullYear() +
            " " + date.getHours() +
            ":" + date.getMinutes() +
            ":" + date.getSeconds(),
          'value': element.value
        };
        this.pieJsonData.push(jsonData);
        this.chartHideTwo = true;

      });

    }, err => console.log(err));

  }

  searchDateWise() {
    if (this.dataPoint.pointLocator.dataType === 'BINARY'
      || this.dataPoint.pointLocator.dataType === 'NUMERIC') {
      this.lineChartDateWise();
    } else if (this.dataPoint.pointLocator.dataType === 'MULTISTATE') {
      this.pieChartDateWise();
    }
  }
}
