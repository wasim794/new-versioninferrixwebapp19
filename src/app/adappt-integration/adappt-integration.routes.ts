// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';
// import { ProvisionComponent, UnprovisionComponent } from '../adappt-integration';
// const routes: Routes = [
//     {path: 'adapt/provision', component: ProvisionComponent},
//     {path: 'adapt/un-provision', component: UnprovisionComponent},
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class AdaptIntegrationRoutingModule {
// }



// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const adapptsRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./adappt-integration.component').then(m => m.AdapptIntegrationComponent),
    children: [
      { path: '', redirectTo: 'adapt', pathMatch: 'full' }, // Default to list
      {
        path: '', // Matches /datasource/list
        loadComponent: () => import('./adappt-integration.component').then(m => m.AdapptIntegrationComponent),
      },
      {
        path: 'adapt/provision', // Matches /datasource/detail/:id
        loadComponent: () => import('./pages/provision/provision.component').then(m => m.ProvisionComponent),
      },
      {
        path: 'adapt/un-provision', // Matches /datasource/detail/:id
        loadComponent: () => import('./pages/unprovision/unprovision.component').then(m => m.UnprovisionComponent),
      },
      {
        path: 'adapt/mqtt-setting', // Matches /datasource/detail/:id
        loadComponent: () => import('./pages/mqtt-setting/mqtt-setting.component').then(m => m.MqttSettingComponent),
      }
   
    ],
  },
];