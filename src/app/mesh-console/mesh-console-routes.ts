// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const meshConsoleRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./mesh-console.component').then(m => m.MeshConsoleComponent),
    children: [
      { path: '', redirectTo: 'detail', pathMatch: 'full' }, // Default to list
      {
        path: 'detail', // Matches /datasource/list
        loadComponent: () => import('./mesh-console.component').then(m => m.MeshConsoleComponent),
      },
      {
        path: 'diagnostics', // Matches /datasource/datapoint/detail
        loadComponent: () => import('./pages/mesh-console-dignostics/mesh-console-diagnostics.component').then(m => m.MeshConsoleDiagnosticsComponent),
      },
      {
        path: 'mesh-node', // Matches /datasource/datapoint/detail
        loadComponent: () => import('./pages/mesh-node/mesh-node.component').then(m => m.MeshNodeComponent),
      },

      {
        path: 'mesh-node/dignostics-detail/:id', // Matches /datasource/datapoint/detail
        loadComponent: () => import('./pages/mesh-node/mesh-dignostics-details/mesh-dignostics-details.component').then(m => m.MeshDignosticsDetailsComponent),
      },

      {
        path: 'config-settings', // Matches /datasource/datapoint/detail
        loadComponent: () => import('./setting-page/config-settings/config-settings.component').then(m => m.ConfigSettingsComponent),
      },
      {
        path: 'firmware-push', // Matches /datasource/datapoint/detail
        loadComponent: () => import('./pages/firmware-push/firmware-push.component').then(m => m.FirmwarePushComponent),
      },
      {
        path: 'firmware-push/node-status', // Matches /datasource/datapoint/detail
        loadComponent: () => import('./pages/firmware-push/node-status/node-status.component').then(m => m.NodeStatusComponent),
      },
    ],
  },
];




// import {NgModule} from '@angular/core';
// import {RouterModule, Routes} from '@angular/router';
// import {MeshConsoleComponent} from './mesh-console.component';
// import {ConfigSettingsComponent} from './setting-page/config-settings';
// import {
//   MeshConsoleDiagnosticsComponent,
//   FirmwarePushComponent,
//   NodeStatusComponent,
//   OtapFileComponent,
//   PublishOnMeshComponent,
//   ProvisionComponent,
//   UnprovisionComponent,
//   MeshNodeComponent,
//   MeshDignosticsDetailsComponent,
//   ThermostatComponent,
//   TofComponent

// } from './pages';

// const routes: Routes = [
//   {path: 'detail', component: MeshConsoleComponent},
//   // {path: 'diagnostics', component: MeshConsoleDiagnosticsComponent},
//   {path: 'mesh-node', component: MeshNodeComponent},
//   {path: 'mesh-node/dignostics-detail/:id', component: MeshDignosticsDetailsComponent},
//   {path: 'config-settings', component: ConfigSettingsComponent},
//   {path: 'firmware-push', component: FirmwarePushComponent},
//   {path: 'firmware-push/node-status', component: NodeStatusComponent},
//   {path: 'firmware-push/otap-file', component: OtapFileComponent},
//   {path: 'publish-on-mesh', component: PublishOnMeshComponent},
//   {path: 'publish-on-mesh/provision', component: ProvisionComponent},
//   {path: 'publish-on-mesh/unprovision', component: UnprovisionComponent},
//   {path:'thermostat', component:ThermostatComponent},
//   {path:'tof', component:TofComponent},
//   {
//     path: 'modbus',
//     loadChildren: () => import('../modbus-configration/modbus-config.module').then(m => m.ModbusConfigModule),
//   },

// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class MeshConsoleRoutingModule {
// }
