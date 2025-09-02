import { Routes } from '@angular/router';

export const meshConsoleRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () =>
      import('./mesh-console.component').then(m => m.MeshConsoleComponent),
    children: [
      { path: '', redirectTo: 'detail', pathMatch: 'full' }, // Default to detail
      {
        path: 'detail', // Matches /datasource/detail
        loadComponent: () =>
          import('./mesh-console.component').then(m => m.MeshConsoleComponent),
      },
    ],
  },
  {
    path: 'diagnostics', // Matches /datasource/diagnostics
    loadComponent: () =>
      import('./pages/mesh-console-dignostics/mesh-console-diagnostics.component').then(
        m => m.MeshConsoleDiagnosticsComponent
      ),
  },
  {
    path: 'mesh-node', // Matches /datasource/mesh-node
    loadComponent: () =>
      import('./pages/mesh-node/mesh-node.component').then(m => m.MeshNodeComponent),
  },
  {
    path: 'mesh-node/dignostics-detail/:id', // Matches /datasource/mesh-node/dignostics-detail/:id
    loadComponent: () =>
      import('./pages/mesh-node/mesh-dignostics-details/mesh-dignostics-details.component').then(
        m => m.MeshDignosticsDetailsComponent
      ),
  },
  {
    path: 'config-settings', // Matches /datasource/config-settings
    loadComponent: () =>
      import('./setting-page/config-settings/config-settings.component').then(
        m => m.ConfigSettingsComponent
      ),
  },
  {
    path: 'firmware-push', // Matches /datasource/firmware-push
    loadComponent: () =>
      import('./pages/firmware-push/firmware-push.component').then(m => m.FirmwarePushComponent),
  },
  {
    path: 'firmware-push/node-status', // Matches /datasource/firmware-push/node-status
    loadComponent: () =>
      import('./pages/firmware-push/node-status/node-status.component').then(m => m.NodeStatusComponent),
  },
  {
    path: 'firmware-push/otap-file', // Matches /datasource/firmware-push/node-status
    loadComponent: () =>
      import('./pages/firmware-push/otap-file/otap-file.component').then(m => m.OtapFileComponent),
  },
  {
    path:'modbus',
    loadChildren: () => import('../modbus-configration/modbus-config-routes').then(m => m.modbusRoutes),
  }

 

  
];
