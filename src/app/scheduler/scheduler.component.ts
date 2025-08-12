import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {CommonService} from '../services/common.service';
import {UnsubscribeOnDestroyAdapter} from '../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {SchedulerService} from './services';
import {SchedulerFormSetComponent} from './scheduler-form-set';
import {CalendarComponent} from './calendar';
import {param} from "jquery";
import {DictionaryService} from "../core/services/dictionary.service";
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";
import {OwlDateTimeComponent} from "@danielmoncada/angular-datetime-picker";
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../common/mat-module';

@Component({
  standalone: true,
  imports: [ CommonModule, MatModuleModule,SchedulerFormSetComponent, CalendarComponent],
  providers: [CommonService, SchedulerService, DictionaryService],
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: []
})
export class SchedulerComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('scheduler') public scheduler!: MatSidenav;
  @ViewChild(SchedulerFormSetComponent)
  public schedulerFormSetComponent!: SchedulerFormSetComponent;
  @ViewChild(CalendarComponent)
  public calendarComponent!: CalendarComponent;
  token: string;
  errorMsg!: any;
  Schedulers: any = [];
  values!: string;
  push: any;
  totalScheduler!: number;
  limit = 8;
  offset = 0;
  deleteScheduler: any;
  pageSizeOptions: number[] = [8, 12, 16, 20];
  deleteError="delete successful";
  UIDICTIONARY : any;

  constructor(public commonService: CommonService, public dictionaryService: DictionaryService, private schedulerService: SchedulerService
  ) {
    super();
    this.token = JSON.parse(localStorage.getItem('access_token')!).token;

  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('scheduler').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
    });
    this.push = "push";
    this.paramCondition();


  }


  addNewScheduler() {
    this.schedulerFormSetComponent.resetScheduler();
    this.scheduler.open();
  }

  schedulerHelp() {
    alert("coming soon");
  }

  savedData(event: any) {
    this.paramCondition();
    this.scheduler.close();
    this.schedulerFormSetComponent.clearSelectionsAll(event);
    this.paramCondition();
  }


  getAllDataScheduler(param: any) {
    this.schedulerService.get(param).subscribe((result: any) => {
      this.Schedulers = result;
      console.log(this.Schedulers);
      this.totalScheduler = this.schedulerService.total;
    });
  }

  allClosed(event: any) {
    this.scheduler.close();
  }

  editScheduler(scheduler: any) {
    this.schedulerFormSetComponent.showSchedulerDetail(scheduler.xid);
    this.scheduler.open();
  }

  getSchedulerNextPage(event: any) {
    const limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    const param = 'limit(' + limit + ',' + this.offset + ')';
    this.getAllDataScheduler(param);
  }

  paramCondition() {
    const param = 'limit(' + this.limit + ',' + this.offset + ')';
    this.getAllDataScheduler(param);
  }


  deleteSchedulers(scheduler: any): void {
    this.deleteScheduler = scheduler;
    this.commonService.openConfirmDialog('Are you want to delete ', scheduler.name).afterClosed().subscribe(response => {
      if (response) {
        this.schedulerService.delete(this.deleteScheduler.xid).subscribe((data: any) => {
          this.Schedulers = this.Schedulers.filter((h:any) => h !== this.deleteScheduler);
          this.commonService.notification(this.deleteError);
        });
      }
    });
  }

  schedularHelp() {

    alert("hello");

  }

  goBack(){
    this.commonService.goBackHistory();
  }

}
