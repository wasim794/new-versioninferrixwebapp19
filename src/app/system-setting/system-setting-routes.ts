// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./system-setting.component').then(m => m.SystemSettingComponent),
    children: [
      { path: '', redirectTo: 'detail', pathMatch: 'full' }, // Default to list
      {
        path: 'detail', // Matches /datasource/list
        loadComponent: () => import('./system-setting.component').then(m => m.SystemSettingComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];




// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';
// import {SystemSettingComponent} from './system-setting.component';
// import {BacnetComponent, BacnetDeviceBrowserComponent} from '../bacnet';
// import {DbUtilityComponent} from '../db-utility';
// import {PlatformIntegrationComponent} from '../platform-integration/platform-integration.component';
// import {AdapptIntegrationComponent} from '../adappt-integration';
// const routes: Routes = [
//   {path: 'detail', component: SystemSettingComponent},
//   {path: 'bacnet', component: BacnetComponent},
//   {path: 'db-utility', component: DbUtilityComponent},
//   {path: 'platform-integration', component: PlatformIntegrationComponent},
//   {path: 'adapt', component: AdapptIntegrationComponent},
//   {path:'bacnet-device-browser', component: BacnetDeviceBrowserComponent}
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class SystemSettingRoutingModule {
// }
