import {Component, ViewChild, AfterViewInit, OnInit} from "@angular/core";
import {DictionaryService} from "../../core/services/dictionary.service";
import {DataService} from "../calendar";
import {MatDialog} from "@angular/material/dialog";
import {ExceptionDialogComponent} from "../exception-dialog/exception-dialog.component";
import {CommonService} from "../../services/common.service";
import {UnsubscribeOnDestroyAdapter} from "../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {CalendarRuleSetService, SchedulerService} from "../services/";
import {CalendarRuleSetModel} from "../model/calendar-rule-set.model";
import {CalendarRule} from "../model/calendar-rule";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../common/mat-module";

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DataService, DictionaryService, CommonService, CalendarRuleSetService, SchedulerService],
  selector: "app-exception-data",
  templateUrl: "./exception-data.component.html",
  styleUrls: [],
})
export class ExceptionDataComponent
  extends UnsubscribeOnDestroyAdapter
  implements AfterViewInit {
  errorMsg!: string;
  public rulesLists!: CalendarRuleSetModel[];
  dataFetch: any = [];
  object = []
  calendarRuleType!: string;
  exId: any;
  events: any;
  selectedRule: any;
  startTimeEx!: string;
  endTimeEx!: string;
  selected: Date[] = [];
  UIDICTIONARY : any;

  constructor(
    private ds: DataService,
    public dialog: MatDialog,
    public dictionaryService: DictionaryService,
    private commonService: CommonService,
    private calendarRuleSetService: CalendarRuleSetService
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.getRules();
    this.loadEventsEx(event);

  }


  ngOnInit() {
    this.dictionaryService.getUIDictionary('scheduler').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.generateThisWeeks();

  }

  setCurrentTime():void {
    const now = new Date();
    let hours: any = now.getHours();
    let minutes: any = now.getMinutes();

    // Pad single-digit minutes with a leading zero
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    // Format hours as two digits
    if (hours < 10) {
      hours = '0' + hours;
    }


// Format time as HH:MM
    this.startTimeEx = `${hours}:${minutes}`;
    this.endTimeEx = `${hours}:${minutes}`;

  }

  generateThisWeeks() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const sundayDate = new Date(today);
    sundayDate.setDate(today.getDate() - currentDay); // Find the Sunday of the current week

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(sundayDate);
      currentDate.setDate(sundayDate.getDate() + i);
      this.selected.push(currentDate);

    }

  }




  getRules() {
    this.subs.add(
      this.calendarRuleSetService.get().subscribe(
        (data) => {
          this.rulesLists = data;
          this.selectedRule = this.rulesLists[0].name;

        },
        (err) => (this.errorMsg = err)
      )
    );
  }


  getValueXid(event: any) {
    if (event.source.selected) {
      this.subs.add(this.calendarRuleSetService.getByXid(event.source.value).subscribe(data => {
        this.dataFetch = data;
      }, error => {
        console.log('Error in ' + JSON.stringify(error));
      }));
    }
  }


  loadEventsEx(event: any): void {
    if(event===undefined || event.length==0 || event[0]===undefined ) {
    }else{
      this.calendarRuleType = event[0].ruleSet.xid;
      this.startTimeEx = event[0].schedule[0];
      this.endTimeEx = event[0].schedule[1];
    }
  }


  addRules() {
    const dialogRef = this.dialog
      .open(ExceptionDialogComponent, {
        width: "600px",
        height: "500px",
        panelClass: "exceptionalAdd",
        data: {xid: '1'},
        disableClose: true
      })
    dialogRef.afterClosed().subscribe(result => {
      this.getRules();
      this.exId = result.xid;
      });
  }

  editRules() {
    const dialogRef = this.dialog
      .open(ExceptionDialogComponent, {
        width: "600px",
        height: "500px",
        panelClass: "exceptionalAdd",
        disableClose: true,
        data: {xid: this.calendarRuleType,},
      })
      .afterClosed()
      .subscribe((response) => {
        this.getRules();

      });
  }

  clearSelectionsEx(event: any) {

  }


}
