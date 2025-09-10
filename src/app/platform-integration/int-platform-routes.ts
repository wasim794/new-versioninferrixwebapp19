import { Routes } from '@angular/router';

export const platformIntegrationRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./platform-integration.component').then(m => m.PlatformIntegrationComponent),
    children: [
      { path: '', redirectTo: 'platform-integration', pathMatch: 'full' }, // Default to list
      {
        path: 'detail', // Matches /datasource/list
       loadComponent: () => import('./platform-integration.component').then(m => m.PlatformIntegrationComponent),
      }
    ],
  },
  {
    path: 'mqtt', // Matches /platform-integration/mqtt
    loadComponent: () => import('./pages/mqtt-configuration/mqtt-configuration.component').then(m => m.MqttConfigurationComponent),
  },
  {
    path: 'provision', // Matches /platform-integration/provision
    loadComponent: () => import('./pages/provision-devices/provision-devices.component').then(m => m.ProvisionDevicesComponent),
  },
  {
    path: 'un-provision', // Matches /platform-integration/un-provision
    loadComponent: () => import('./pages/unprovisioned-devices/unprovisioned-devices.component').then(m => m.UnprovisionedDevicesComponent),
  },
  {
    path: 'serverDetails', // Matches /platform-integration/serverDetails
    loadComponent: () => import('./pages/server-details/server-detail-list/server-detail-list.component').then(m => m.ServerDetailListComponent),
  },
  {
    path: 'deviceConfiguration', // Matches /platform-integration/deviceConfiguration
    loadComponent: () => import('./pages/device-profile/device-profile.component').then(m => m.DeviceProfileComponent),
  }

];

