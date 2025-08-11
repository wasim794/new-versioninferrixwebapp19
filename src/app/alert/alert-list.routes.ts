// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const alertListRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./alert-list/alert-list.component').then(m => m.AlertListComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /datasource/list
        loadComponent: () => import('./alert-list/alert-list.component').then(m => m.AlertListComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];


// import {NgModule} from '@angular/core';
// import {CommonModule} from '@angular/common';
// import {AlertListRoutingModule} from './alert-list-routing.module';
// import {AlertEditComponent, AlertListComponent} fro.ert';
// import {FormsModule} from '@angular/forms';
// import {UsersService} from '../users/service';
// import {LayoutModule} from '@angular/cdk/layout';
// import {FlexLayoutModule} from '@angular/flex-layout';
// import {MatModuleModule} from '../common/mat-module';

// @NgModule({
//   declarations: [AlertListComponent, AlertEditComponent],
//   imports: [AlertListRoutingModule,
//     CommonModule, FormsModule, MatModuleModule,
//     LayoutModule, FlexLayoutModule
//   ],
//   entryComponents: [AlertEditComponent],
//   providers: [
//     UsersService
//   ],
// })
// export class AlertListModule {
// }
