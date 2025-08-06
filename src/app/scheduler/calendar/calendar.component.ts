import {Component, ViewChild, AfterViewInit, Input} from "@angular/core";
import {DictionaryService} from "../../core/services/dictionary.service";
import {SchedulerService} from '../services';
import {UnsubscribeOnDestroyAdapter} from '../../common';
// import {cleanData, event} from "jquery";
import { CommonModule } from "@angular/common";
import { MatModuleModule } from "../../common/mat-module";

@Component({
  standalone: true,
  imports: [CommonModule, MatModuleModule],
  providers: [DictionaryService, SchedulerService],
  selector: "calendar-component",
  templateUrl: `./calendar.component.html`,
  styles: [],
})
export class CalendarComponent extends UnsubscribeOnDestroyAdapter implements AfterViewInit {
  @Input() toggleAll:any;
  weekIsChecked!:boolean;
  weekDaysIsChecked!:boolean;
  weekEndIsChecked!:boolean;
  now = Date.now();
  selected: Date[] = [];
  weekDayss!:boolean;
  weekendDays!: boolean;
  allWeekDays: string[] = [];
  startTime!: string;
  endTime!: string;
  UIDICTIONARY : any;

  constructor(public dictionaryService: DictionaryService) {
    super();
    this.viewWeek(event);
  }

  ngAfterViewInit(): void {



  }

  ngOnInit() {
    this.dictionaryService.getUIDictionary('scheduler').subscribe(data=>{
    this.UIDICTIONARY = this.dictionaryService.uiDictionary;
   });
    this.generateThisWeek();

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
    this.startTime = `${hours}:${minutes}`;
    this.endTime = `${hours}:${minutes}`;
  }

  generateThisWeek() {
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

  revertSch(event: any): void {
    this.clearSelections(event);
  }

  loadEvents(result: any): void {
    if (result === '') {
      this.setCurrentTime();
      this.clearSelections(result);
    } else {
      if(result.defaultSchedule.filter((array: any) => array.length > 0).length==5){
        this.weekDaysIsChecked=true;
        this.weekEndIsChecked=false;
        this.startTime = result.defaultSchedule[1][0];
        this.endTime = result.defaultSchedule[1][1];
        this.viewWeekDays(event);
      }else if(result.defaultSchedule.filter((array: any) => array.length > 0).length==2){
        this.weekEndIsChecked=true;
        this.weekDaysIsChecked=false;
        this.startTime = result.defaultSchedule[0][0];
        this.endTime = result.defaultSchedule[0][1];
        this.viewWeekEnd(event);
      }
      else if(result.defaultSchedule.filter((array: any) => array.length > 0).length==7){
        this.weekEndIsChecked=false;
        this.weekDaysIsChecked=false;
        this.weekIsChecked=true;
        this.startTime = result.defaultSchedule[0][0];
        this.endTime = result.defaultSchedule[0][1];
        this.viewWeek(event);
      }
      this.countArrays(result);

    }
  }

  countArrays(result: any) {

  }

  clearSelections(event: any) {
  }

  viewWeek(event: any): void {
    this.weekDayss = true;
    this.weekendDays = true;
    this.weekIsChecked = true;
    this.weekDaysIsChecked = false;
    this.weekEndIsChecked = false;
  }

  viewWeekDays(event: any): void {
    this.weekDayss = true;
    this.weekendDays = false;
    this.weekIsChecked = false;
    this.weekDaysIsChecked = true;
    this.weekEndIsChecked = false;
  }

  viewWeekEnd(event: any): void {
    this.weekDayss = false;
    this.weekendDays = true;
    this.weekIsChecked = false;
    this.weekDaysIsChecked = false;
    this.weekEndIsChecked = true;
  }
}
