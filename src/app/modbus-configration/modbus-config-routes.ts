import { Routes } from '@angular/router';

export const modbusRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./modbus-configration.component').then(m => m.ModbusConfigrationComponent),
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' }, // Default to detail
      {
        path: 'modbus', // Matches /datasource/detail
        loadComponent: () =>
          import('./modbus-configration.component').then(m => m.ModbusConfigrationComponent),
      },
    ],
  },
  {
    path:'discovered',
    loadComponent: () => import('./page/controller-nodes/discovered-nodes.component').then(m => m.DiscoveredNodesComponent),
  }
  


];



// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';
// import {ModbusConfigrationComponent} from "./modbus-configration.component";
// import {
//   ConfigProfileComponent,
//   DiscoveredNodesComponent,
//   ModbusDeviceComponent, ModbusDeviceAttributesComponent
// } from "./page";


// const routes: Routes = [
//   {path: '', component: ModbusConfigrationComponent},
//   {path: 'profile', component: ConfigProfileComponent},
//   {path: 'discovered', component: DiscoveredNodesComponent},
//   {path: 'device', component: ModbusDeviceComponent},
//   {path: 'attribute', component: ModbusDeviceAttributesComponent},

// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class ModbusConfigRoutingModule {
// }
