// import {NgModule} from '@angular/core';
// import {CommonModule} from '@angular/common';
// import {SchedulerComponent} from './scheduler.component';
// import {SchedulerRoutingModule} from './scheduler-routing.module';
// import {SchedulerFormSetComponent} from './scheduler-form-set/scheduler-form-set/scheduler-form-set.component';
// import {MatModuleModule} from '../common/mat-module';
// import {CalendarModule} from './calendar';
// //import { ExceptionDataComponent } from './exception-data/exception-data.component';
// import {OwlDateTimeModule, OwlNativeDateTimeModule} from '@danielmoncada/angular-datetime-picker';
// import {ExceptionDialogComponent} from './exception-dialog/exception-dialog.component';
// import {DayPilotModule} from "@daypilot/daypilot-lite-angular";
// import {ReactiveFormsModule} from "@angular/forms";

// @NgModule({
//   declarations: [SchedulerComponent, SchedulerFormSetComponent, ExceptionDialogComponent],
//     imports: [
//         CommonModule, SchedulerRoutingModule, MatModuleModule, CalendarModule, DayPilotModule, ReactiveFormsModule, OwlDateTimeModule, OwlNativeDateTimeModule
//     ]
// })
// export class SchedulerModule {
// }



// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const schedulerRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./scheduler.component').then(m => m.SchedulerComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /datasource/list
        loadComponent: () => import('./scheduler.component').then(m => m.SchedulerComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];