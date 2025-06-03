
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import moment from 'moment';
import { MatModuleModule } from '../../mat-module';

@Component({
  standalone: true,
  imports: [MatModuleModule, CommonModule],
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: []
})
export class DatePickerComponent implements OnInit {

  public date = moment();
  public dateForm!: FormGroup;

  public isReserved = null;

  public daysArr!: moment.Moment[];

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
    // this.daysArr = this.createCalendar(this.date);
  }

  // public createCalendar(month: moment.MomentInput) {
  //   let firstDay = moment(month).startOf('M');
  //   let days = Array.apply(null, {
  //     // length: month.daysInMonth(),
  //     pop: function (): unknown {
  //       throw new Error('Function not implemented.');
  //     },
  //     push: function (...items: unknown[]): number {
  //       throw new Error('Function not implemented.');
  //     },
  //     concat: function (...items: ConcatArray<unknown>[]): unknown[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     join: function (separator?: string): string {
  //       throw new Error('Function not implemented.');
  //     },
  //     reverse: function (): unknown[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     shift: function (): unknown {
  //       throw new Error('Function not implemented.');
  //     },
  //     slice: function (start?: number, end?: number): unknown[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     sort: function (compareFn?: ((a: unknown, b: unknown) => number) | undefined): unknown[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     splice: function (start: number, deleteCount?: number): unknown[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     unshift: function (...items: unknown[]): number {
  //       throw new Error('Function not implemented.');
  //     },
  //     indexOf: function (searchElement: unknown, fromIndex?: number): number {
  //       throw new Error('Function not implemented.');
  //     },
  //     lastIndexOf: function (searchElement: unknown, fromIndex?: number): number {
  //       throw new Error('Function not implemented.');
  //     },
  //     every: function <S extends unknown>(predicate: (value: unknown, index: number, array: unknown[]) => value is S, thisArg?: any): this is S[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     some: function (predicate: (value: unknown, index: number, array: unknown[]) => unknown, thisArg?: any): boolean {
  //       throw new Error('Function not implemented.');
  //     },
  //     forEach: function (callbackfn: (value: unknown, index: number, array: unknown[]) => void, thisArg?: any): void {
  //       throw new Error('Function not implemented.');
  //     },
  //     map: function <U>(callbackfn: (value: unknown, index: number, array: unknown[]) => U, thisArg?: any): U[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     filter: function <S extends unknown>(predicate: (value: unknown, index: number, array: unknown[]) => value is S, thisArg?: any): S[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     reduce: function (callbackfn: (previousValue: unknown, currentValue: unknown, currentIndex: number, array: unknown[]) => unknown): unknown {
  //       throw new Error('Function not implemented.');
  //     },
  //     reduceRight: function (callbackfn: (previousValue: unknown, currentValue: unknown, currentIndex: number, array: unknown[]) => unknown): unknown {
  //       throw new Error('Function not implemented.');
  //     },
  //     find: function <S extends unknown>(predicate: (value: unknown, index: number, obj: unknown[]) => value is S, thisArg?: any): S | undefined {
  //       throw new Error('Function not implemented.');
  //     },
  //     findIndex: function (predicate: (value: unknown, index: number, obj: unknown[]) => unknown, thisArg?: any): number {
  //       throw new Error('Function not implemented.');
  //     },
  //     fill: function (value: unknown, start?: number, end?: number): unknown[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     copyWithin: function (target: number, start: number, end?: number): unknown[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     entries: function (): ArrayIterator<[number, unknown]> {
  //       throw new Error('Function not implemented.');
  //     },
  //     keys: function (): ArrayIterator<number> {
  //       throw new Error('Function not implemented.');
  //     },
  //     values: function (): ArrayIterator<unknown> {
  //       throw new Error('Function not implemented.');
  //     },
  //     includes: function (searchElement: unknown, fromIndex?: number): boolean {
  //       throw new Error('Function not implemented.');
  //     },
  //     flatMap: function <U, This = undefined>(callback: (this: This, value: unknown, index: number, array: unknown[]) => U | readonly U[], thisArg?: This | undefined): U[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     flat: function <A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[] {
  //       throw new Error('Function not implemented.');
  //     },
  //     at: function (index: number): unknown {
  //       throw new Error('Function not implemented.');
  //     },
  //     [Symbol.iterator]: function (): ArrayIterator<unknown> {
  //       throw new Error('Function not implemented.');
  //     },
  //     [Symbol.unscopables]: undefined
  //   })
  //     .map(Number.call, Number)
  //     .map(n => {
  //       return moment(firstDay).add(n, 'd');
  //     });

  //   for (let n = 0; n < firstDay.weekday(); n++) {
  //     days.unshift(null);
  //   }
  //   return days;
  // }

  // public nextMonth() {
  //   this.date.add(1, 'M');
  //   this.daysArr = this.createCalendar(this.date);
  // }

  // public previousMonth() {
  //   this.date.subtract(1, 'M');
  //   this.daysArr = this.createCalendar(this.date);
  // }

  // public todayCheck(day: { format: (arg0: string) => string; }) {
  //   if (!day) {
  //     return false;
  //   }
  //   return moment().format('L') === day.format('L');
  // }

  // public reserve() {
  //   if (!this.dateForm.valid) {
  //     return;
  //   }
  //   let dateFromMoment = this.dateForm.value.dateFrom;
  //   let dateToMoment = this.dateForm.value.dateTo;
  //   this.isReserved = `Reserved from ${dateFromMoment} to ${dateToMoment}`;
  // }



  // public selectedDate(day: { format: (arg0: string) => any; }) {
  //   let dayFormatted = day.format('MM/DD/YYYY');
  //   if (this.dateForm.valid) {
  //     this.dateForm.setValue({ dateFrom: null, dateTo: null });
  //     return;
  //   }
  //   if (!this.dateForm.get('dateFrom').value) {
  //     this.dateForm.get('dateFrom').patchValue(dayFormatted);
  //   } else {
  //     this.dateForm.get('dateTo').patchValue(dayFormatted);
  //   }
  // }
}
