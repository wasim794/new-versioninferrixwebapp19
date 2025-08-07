import {DictionaryService} from "../../core/services/dictionary.service";
import {
  Component,
  ViewChild,
  AfterViewInit, OnInit, Inject
} from "@angular/core";
import {CalendarRuleSetModel} from '../model/calendar-rule-set.model';
import {CommonService} from "../../services/common.service";
import {UnsubscribeOnDestroyAdapter} from "../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter";
import {ScheduleModel} from "../model/schedule.model";
import {CalendarRuleSetService} from '../services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../common/mat-module";

export interface DialogData {
  rules: CalendarRuleSetModel;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule, ReactiveFormsModule],
  providers: [CommonService, CalendarRuleSetService, DictionaryService],
  selector: 'app-exception-dialog',
  templateUrl: './exception-dialog.component.html',
  styleUrls: []
})
export class ExceptionDialogComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  calendarRuleSetModel: CalendarRuleSetModel = new CalendarRuleSetModel();
  schedule: any = new ScheduleModel();
  permissions = [];
  rule: any = [];
  rulesError: any = [];
  selected!: Date | any;
  type!: string;
  schedulerButtonsView!: boolean;
  startDate!: string;
  UIDICTIONARY : any;
  range: any = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  public messageError!: boolean;

  constructor(private commonService: CommonService,
              public dictionaryService: DictionaryService,
              private calendarRuleSetService: CalendarRuleSetService,
              public dialogRef: MatDialogRef<ExceptionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) {
    super();

  }

  ngOnInit(): void {
    this.dictionaryService.getUIDictionary('scheduler').subscribe(data=>{
      this.UIDICTIONARY = this.dictionaryService.uiDictionary;
      });
    this.setPointsandPermission();
    this.getData();
    if (this.data.xid === '1') {
      this.schedulerButtonsView = false;
    } else {
      this.schedulerButtonsView = true;
    }
  }

  setPointsandPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  setRule(event: any) {
    this.type = 'WildcardDateRangeRule1';
    this.calendarRuleSetModel.rules = this.rule;
    this.calendarRuleSetModel.editPermission = this.permissions.toString();
    if (this.selected === null || this.selected === undefined) {
      this.dateRangeSelect();
    } else {
      this.singleDate();
    }
    // return false;
    this.subs.add(this.calendarRuleSetService.create(this.calendarRuleSetModel).subscribe(data => {
      this.calendarRuleSetModel = data;
      this.dialogRef.close('Pizza!');
    }, error => {
      this.rulesError = error.result.message;
      this.timeOutFunction();
    }));

  }

  updateRule(event: any) {
    this.type = 'WildcardDateRangeRule1';
    this.calendarRuleSetModel.rules = this.rule;
    this.calendarRuleSetModel.editPermission = this.permissions.toString();
    if (this.selected === null || this.selected === undefined) {
      this.dateRangeSelect();
    } else {
      this.singleDate();
    }
    this.subs.add(this.calendarRuleSetService.update(this.calendarRuleSetModel).subscribe(data => {
      this.calendarRuleSetModel = data;
    }, error => {
      this.rulesError = error.result.message;
      this.timeOutFunction();
    }));

  }
  private timeOutFunction() {
    this.messageError = true;
    setTimeout(() => {
      this.messageError = false;
    }, 10000);
  }


  convert(str: any): string {
    let date = new Date(this.selected),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  dateRangeSelect() {
    let myStartDate = new Date(this.range.value.start).toISOString().slice(0, 10);
    let startYear = myStartDate.substr(0, 4);
    let startMonth = myStartDate.substr(5, 2);
    let startDay = myStartDate.substr(8, 10);
    let myEndDate = new Date(this.range.value.end).toISOString().slice(0, 10);
    let endYear = myEndDate.substr(0, 4);
    let endMonth = myEndDate.substr(5, 2);
    let endDay = myEndDate.substr(8, 10);
    let start = {
      'type': 'WildcardDateRule1', 'year': startYear,
      'month': startMonth, 'day': startDay, 'dayOfWeek': null,
    };
    let end = {
      'type': 'WildcardDateRule1', 'year': endYear,
      'month': endMonth, 'day': endDay, 'dayOfWeek': null,
    };
    this.rule.push({
      'type': this.type, 'startDate': start, 'endDate': end,
    });
  }

  singleDate() {
    let myDate = new Date(this.selected).toISOString().slice(0, 10);
    let year = myDate.substr(0, 4);
    let month = myDate.substr(5, 2);
    let day = myDate.substr(8, 10);
    let start = {
      'type': 'WildcardDateRule1', 'year': year,
      'month': month, 'day': day, 'dayOfWeek': null,
    };
    let end = {
      'type': 'WildcardDateRule1', 'year': year,
      'month': month, 'day': day, 'dayOfWeek': null,
    };
    this.rule.push({
      'type': this.type, 'startDate': start, 'endDate': end,
    });
  }


  getData() {
    this.subs.add(this.calendarRuleSetService.getByXid(this.data.xid).subscribe(data => {
      this.calendarRuleSetModel = data;
      const year = this.calendarRuleSetModel.rules[0].startDate.year;
      const month = this.calendarRuleSetModel.rules[0].startDate.month;
      const day = this.calendarRuleSetModel.rules[0].startDate.day;
      const addRules = year + '-' + month + '-' + day;
      const date = new Date(addRules);
      this.selected = date;

    }));
  }


//  create rules


}
