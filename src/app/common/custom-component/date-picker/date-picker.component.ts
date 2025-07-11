import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import moment from 'moment';
import { MatModuleModule } from '../../mat-module';

@Component({
  standalone: true,
  imports: [MatModuleModule, CommonModule, ReactiveFormsModule],
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: []
})
export class DatePickerComponent implements OnInit {

  public date = moment();
  public dateForm!: FormGroup;

  public isReserved = '';

  public daysArr!: (moment.Moment | null)[];

  constructor(private fb: FormBuilder) {
    this.initDateRange();
  }

  public initDateRange() {
    return (this.dateForm = this.fb.group({
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required]
    }));
  }

  public ngOnInit() {
    this.daysArr = this.createCalendar(this.date);
  }

  public createCalendar(month: moment.Moment) {
    const firstDay = moment(month).startOf('M');
    const daysInMonth = month.daysInMonth();
    
    // Create array of days in the month
    const days = Array.from({ length: daysInMonth }, (_, i) => 
      moment(firstDay).add(i, 'd')
    );

    // Add null for days before the first day of the month
    for (let n = 0; n < firstDay.weekday(); n++) {
      days.unshift();
    }
    
    return days;
  }

  public nextMonth() {
    this.date.add(1, 'M');
    this.daysArr = this.createCalendar(this.date);
  }

  public previousMonth() {
    this.date.subtract(1, 'M');
    this.daysArr = this.createCalendar(this.date);
  }

  public todayCheck(day: moment.Moment | null) {
    if (!day) {
      return false;
    }
    return moment().format('L') === day.format('L');
  }

  public reserve() {
    if (!this.dateForm.valid) {
      return;
    }
    let dateFromMoment = this.dateForm.value.dateFrom;
    let dateToMoment = this.dateForm.value.dateTo;
    this.isReserved = `Reserved from ${dateFromMoment} to ${dateToMoment}`;
  }

  public selectedDate(day: moment.Moment | null) {
    if (!day) return;
    
    let dayFormatted = day.format('MM/DD/YYYY');
    if (this.dateForm.valid) {
      this.dateForm.setValue({ dateFrom: null, dateTo: null });
      return;
    }
    if (!this.dateForm.get('dateFrom')?.value) {
      this.dateForm.get('dateFrom')?.patchValue(dayFormatted);
    } else {
      this.dateForm.get('dateTo')?.patchValue(dayFormatted);
    }
  }
}