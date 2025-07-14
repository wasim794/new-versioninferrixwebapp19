// src/app/datasource/datasource.routes.ts
import { Routes } from '@angular/router';

export const eventRoutes: Routes = [
  {
    path: '', // Matches /datasource
    loadComponent: () => import('./events-list/events-list.component').then(m => m.EventsListComponent),
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to list
      {
        path: 'list', // Matches /datasource/list
        loadComponent: () => import('./events-list/events-list.component').then(m => m.EventsListComponent),
      },
    //   {
    //     path: 'datapoint/detail', // Matches /datasource/datapoint/detail
    //     loadComponent: () => import('../datapoint/datapoint-detail/datapoint-detail.component').then(m => m.DatapointDetailComponent),
    //   },
    ],
  },
];