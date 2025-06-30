// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const stackmonitorRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./stack-monitor.component').then(m => m.StackMonitorComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'detail', // Matches /datasource/list
        loadComponent: () => import('./stack-monitor.component').then(m => m.StackMonitorComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];