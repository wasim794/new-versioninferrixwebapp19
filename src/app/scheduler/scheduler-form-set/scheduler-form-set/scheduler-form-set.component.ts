import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit,
  Renderer2,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import {CalendarComponent} from '../../calendar';
import {ExceptionDataComponent} from '../../exception-data/exception-data.component';
import {CommonService} from '../../../services/common.service';
import {AlarmLevelDropdownData} from '../../shared';
import {ScheduleModel} from "../../model/schedule.model";
import {UnsubscribeOnDestroyAdapter} from '../../../common/Unsubscribe-adapter/unsubscribe-on-destroy-adapter';
import {CalendarRuleSetService, SchedulerService} from "../../services";
import {DictionaryService} from "../../../core/services/dictionary.service";
import {FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatModuleModule } from '../../../common/mat-module';


@Component({
  standalone: true,
  imports: [CalendarComponent, ExceptionDataComponent, CommonModule, MatModuleModule, ReactiveFormsModule],
  providers: [CommonService, SchedulerService, CalendarRuleSetService, DictionaryService],
  selector: 'app-scheduler-form-set',
  templateUrl: './scheduler-form-set.component.html',
  styleUrls: []
})
export class SchedulerFormSetComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(CalendarComponent) private calenders!: CalendarComponent;
  @ViewChild(ExceptionDataComponent) private exception!: ExceptionDataComponent;
  @Output() addedSavedScheduler = new EventEmitter<any>();
  enableToggle ='';
  exceptionData: boolean = false;
  @ViewChild('div') div!: ElementRef;
  permissions = [];
  index = 1;
  exceptionRule: any = [];
  schedule: any = new ScheduleModel();
  arraySchedule: Array<any> = [];
  errorMsg: any;
  errorMsgs!: boolean;
  successMsg = 'SuccessFully Add';
  updateMsg = 'Updated SuccessFully';
  schedulerButtonsView!: boolean;
  public dropdownData = new AlarmLevelDropdownData();
  productForm!: FormGroup;
  timeRanges: string[][] = [];
  UIDICTIONARY : any;
  public scheduleCon!: boolean;

  constructor(private commonService: CommonService,
              public dictionaryService: DictionaryService,
              private calendarRuleSetService: CalendarRuleSetService,
              private schedulerService: SchedulerService, private fb: FormBuilder
  ) {
    super();

  }

  ngOnInit() {
   this.dictionaryService.getUIDictionary('scheduler').subscribe(data=>{
   this.UIDICTIONARY = this.dictionaryService.uiDictionary;
     });
    this.setPointsAndPermission();
    this.productForm = this.fb.group({
      quantities: this.fb.array([1]),
    });
  }

  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      qty: '',
      price: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: any) {
    this.exceptionData=false
    this.quantities().removeAt(i);
  }

  AfterContentInit() {

  }

  clearSelectionsAll(event: any) {
    this.calenders.clearSelections(event);
    this.exception.clearSelectionsEx(event);
  }

  setPointsAndPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  dataGetWIthCalender(){
    if(this.calenders.weekIsChecked===true){
      const defaultTimeRange = [this.calenders.startTime, this.calenders.endTime];
      this.schedule.defaultSchedule = Array(7).fill(defaultTimeRange);
    }else if(this.calenders.weekDaysIsChecked==true){
      const defaultTimeRange = [this.calenders.startTime, this.calenders.endTime];
      this.schedule.defaultSchedule = Array(7).fill(defaultTimeRange);
      this.schedule.defaultSchedule[0] = []; // Blank out the first array
      this.schedule.defaultSchedule[6] = []; // Blank out the last array
    }else if(this.calenders.weekEndIsChecked==true){
      const defaultTimeRange = [this.calenders.startTime, this.calenders.endTime];
      this.schedule.defaultSchedule = Array(7).fill(defaultTimeRange);
      for (let i = 1; i <= 5; i++) {
        this.schedule.defaultSchedule[i] = []; // Blank out arrays from index 1 to 5
      }
    }
  }

  addNewScheduler() {

    if (this.schedule.name === undefined || this.schedule.alarmLevel === undefined ||
      this.schedule.errorAlarmLevel === undefined || this.schedule.enabled === undefined) {
      this.errorMsgs = true;
      setInterval(() => {
        this.errorMsgs = false;
      }, 10000)

      return false;
    } else {
      this.schedule.readPermission = this.permissions.toString();
      this.schedule.editPermission = this.permissions.toString();
      this.dataGetWIthCalender();
      if (this.exceptionData === true) {
        if(this.exception.startTimeEx===undefined){
          this.arraySchedule =[];
        }else {
          this.arraySchedule = [this.exception.startTimeEx, this.exception.endTimeEx];
        }
        let ruleSet = this.exception.dataFetch;
        this.exceptionRule.push({
          'schedule': this.arraySchedule, ruleSet
        });
        this.schedule.exceptions = this.exceptionRule;
      } else {
        this.schedule.exceptions = [];
      }

// return ;
      this.subs.add(this.schedulerService.create(this.schedule).subscribe(data => {
        this.commonService.notification(this.successMsg);
        this.addedSavedScheduler.emit(this.schedule);
      }, error => {

      }));

      return true;

    }
  }

  updateScheduler() {

    this.schedule.readPermission = this.permissions.toString();
    this.schedule.editPermission = this.permissions.toString();
    this.dataGetWIthCalender();
    let ruleSet;
    if(this.exceptionData==false){
      this.arraySchedule =[];
      this.exceptionRule = [];

    }else {
      this.arraySchedule = [this.exception.startTimeEx, this.exception.endTimeEx];
      if(this.arraySchedule[0]==undefined){
        this.arraySchedule = [];
      }else{
        this.arraySchedule = [this.exception.startTimeEx, this.exception.endTimeEx];
      }
      ruleSet = this.exception.dataFetch;
      this.exceptionRule.push({
        'schedule': this.arraySchedule, ruleSet
      });
    }

      this.schedule.exceptions = this.exceptionRule;

    // return false;
    this.subs.add(this.schedulerService.update(this.schedule).subscribe(data => {
      this.commonService.notification(this.updateMsg);
      this.addedSavedScheduler.emit(this.schedule);
    }, error => {
    }));

  }

  showSchedulerDetail(xid: any) {
    this.schedulerButtonsView = true;
    this.subs.add(this.schedulerService.getByXid(xid).subscribe(data => {
      this.schedule = data;
      console.log(this.schedule);
      if (this.schedule.exceptions.length === 0) {
        this.exceptionData = false;
      } else {
        this.exceptionData = true;
      }
      this.calenders.loadEvents(this.schedule);
      this.exception.loadEventsEx(this.schedule.exceptions);
      this.exception.getValueXid(this.schedule.exceptions[0].ruleSet.xid);
    }, err => this.errorMsg = err));

    this.scheduleCon = true;

  }

  resetScheduler() {
    this.schedule = new ScheduleModel();
    this.schedulerButtonsView = false;
    const data = '';
    this.calenders.loadEvents(data);
    this.scheduleCon = false;
  }

  addExceptionData() {
    this.exceptionData = true;
  }

  cancelExceptionData() {
    this.exceptionData = false;
  }

  addHelpGuide() {
    alert("coming soon");
  }

}
